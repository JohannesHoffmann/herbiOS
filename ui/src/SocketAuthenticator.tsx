import Axios from "axios";
import React, { useState } from "react";
import { Box, Button, Text } from "rebass";
import {
    Label,
    Input,
  } from '@rebass/forms'
import Config from './Config';
import useLocalStorage from "./utils/useLocalstorage";
import { useUserDispatch, useUserState } from "./contexts/UserContext";

export default function SocketAuthenticator(props: {children: React.ReactElement}) {

      const { authToken } = useUserState();
      const userDispatch = useUserDispatch();
      const [password, setPassword] = useLocalStorage<string>("password", "");

      const [inputPassword, setInputPassword] = useState<string>("");

      const authenticate = React.useCallback(async (password: string) => {
        if (!authToken) {
            try {
                const newToken = await Axios.post(Config.host + "/login", { password });
                userDispatch({type: "LOGIN", authToken: newToken.data.token});
            } catch (e) {}
        }
    }, [authToken, userDispatch]);

      // Set the password via hash in url
      React.useEffect(() => {
          if(window.location.hash) {
            //@ts-ignore
              setPassword(window.location.hash.substring(1));
              // window.location.hash = "";
              authenticate(window.location.hash.substring(1));
          }
      }, [setPassword, authenticate]);


      // Auto reconnect attemt
      React.useEffect(() => {
          if (password && !authToken) {
            authenticate(password as string);
        }
      }, [password, authToken, authenticate]);
 



    return <>
        {!password && <div>

        <Box
            as='form'
            onSubmit={e => e.preventDefault()}
            p={4}>

                <Box width={"100%"} p={2}>
                <Label htmlFor='name'>Zugang</Label>
                <Input
                    id='name'
                    name='pw'
                    value={inputPassword}
                    onChange={(e) => { setInputPassword(e.currentTarget.value)}}
                />
                </Box>
                <Box p={2} ml='auto'>
                <Button width={"100%"} onClick={() => { 
                    //@ts-ignore
                    setPassword(inputPassword);
                    authenticate(inputPassword);
                 }}>
                    Ok
                </Button>
                </Box>
        </Box>                              
    
            
        </div>}
        {password && !authToken && <Box p={6}>
            <Text>
                Der Login schlug fehl. <Button onClick={() => { 
                    //@ts-ignore
                    setPassword("");
                 }}>
                    Anderen Zugang
                </Button>
            </Text>
        </Box>}


        {password && authToken && <>
            {props.children}
        </>}
    </>;
}