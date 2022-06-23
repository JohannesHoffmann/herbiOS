import { useEffect, useMemo, useRef } from "react";
import { useWebSocket } from "./useWebSocket";
import { matches } from 'mqtt-pattern';


export interface IMqttMessage {
    topic: string;
    message?: string; 
}

export function useMqttSubscription(callback: (message: IMqttMessage) => void, topic: string | Array<string>) {
    const topics = useMemo(() => Array.isArray(topic) ? topic : [topic], [topic]);
    const subscribedTopics = useRef<Array<string>>([]);
    const [subscribe] = useWebSocket<null, {topic: string | Array<string>}>(() => {}, "subscribe", "/mqtt");
    // const subscribe = socketSend("subscribe", "/mqtt");


    useWebSocket<{topic: string, message: string}, null>((mqttMessage) => {
        if (!mqttMessage || !mqttMessage?.topic) {
            return;
        }
        if(mqttMessage.topic.startsWith("herbiOS/lights")) console.log("matched", mqttMessage);
        
        if (topics.flat().some(rTopic => matches(rTopic, mqttMessage.topic))) {
            callback(mqttMessage);
        }
    },"message", "/mqtt");

    useEffect(() => {
        const topicsToSubscribe = topics.filter(item => subscribedTopics.current.includes(item) ? false : true);
        if (topicsToSubscribe.length > 0) {
            
            subscribe({topic: topicsToSubscribe});
            subscribedTopics.current = [
                ...subscribedTopics.current,
                ...topicsToSubscribe,
            ];
        }
    }, [subscribe, topics]);

}
