import { useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Config from "../Config";
import { useUserDispatch, useUserState } from "../contexts/UserContext";

let namespaces: {[key: string]: Socket} = {
    "/": io(Config.socket),
};

export function socketSend<M>(type: string, namespace?: string): (message: M) => void {
    return (message: M) => {
        let socket = namespaces["/"];
        if (namespace) {
            if (!namespaces.hasOwnProperty(namespace)) {
                console.warn("The namespace is not registered yet. Please use useWebSocket before.");
                return;
            } 
            socket = namespaces[namespace];
        }
    
        if (socket.connected) {
            socket.emit(type, message);
        }
    }
}

export function useWebSocket<T, M = T>(type: string, namespace?: string): [T | undefined, (message: M) => void] {
    const userState = useUserState();
    const userDispatch = useUserDispatch();
    const [message, setMessage] = useState<T>();
    const mounted = useRef(true);

    let socket = namespaces["/"];
    if (namespace) {
        if (!namespaces.hasOwnProperty(namespace)) {
            namespaces[namespace] = io(Config.socket + namespace);
            namespaces[namespace].on("connect_error", (err: Error) => {
                if (err.message === "not authenticated") {
                    userDispatch({type: "LOGOUT"});
                }
            });
            namespaces[namespace].on("unauthenticated", () => {
                userDispatch({type: "LOGOUT"});
            });

        } 
        socket = namespaces[namespace];
    }

     // act on authToken change caused by login or logout
     useEffect(() => {
        // Login from System
        if (userState.authToken && !socket.connected) {
            socket.auth = {
                token: userState.authToken,
            };
            socket.connect();
        }

        // Logout from System
        if (!userState.authToken) {
            socket.auth = {};
            socket.disconnect();
        }
    }, [userState.authToken, socket]);


    useEffect(() => {
        mounted.current = true;
        function listener(data: T) {
            if (mounted.current === false) {
                return;
            }
            setMessage(data);
        };
        socket.on(type, listener);

        return () => {
            mounted.current = false;
            socket.off(type, listener);
        }
    })

    const defaultNamespace = namespaces[namespace ? namespace : "/"];
    const sendMessage = useCallback((message: M) => {
        defaultNamespace.emit(type, message);
        // eslint-disable-next-line
    }, [defaultNamespace , type, namespace]);

    return [message, sendMessage];
}
