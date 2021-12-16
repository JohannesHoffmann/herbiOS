import { useEffect, useState } from "react";
import { useWebSocket } from "./useWebSocket";
//@ts-ignore
import { matches } from 'mqtt-pattern';


interface IMqttMessage {
    topic: string;
    message?: string; 
}

export function useMqttSubscription(topic: string | Array<string>) {
    const topics = Array.isArray(topic) ? topic : [topic];
    const [message, setMessage] = useState<IMqttMessage>();
    const [subscribed, setSubscribed] = useState<boolean>(false);
    const [mqttMessage] = useWebSocket<{topic: string, message: string}, null>("message", "/mqtt");
    const [, subscribe] = useWebSocket<null, {topic: string | Array<string>}>("subscribe", "/mqtt");

    useEffect(() => {
        if (!subscribed) {
            setSubscribed(() => {
                console.log("Subscribe to", topic);
                subscribe({topic});
                return true;
            })
        }
    })

    useEffect(() => {
        console.log("Message", mqttMessage);
        if (!mqttMessage || !mqttMessage?.topic) {
            return;
        }
        
        if (topics.flat().some(rTopic => matches(rTopic, mqttMessage.topic))) {
            setMessage(mqttMessage);
        }
    }, [mqttMessage]);
    
    return message;
}
