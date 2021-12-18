import { useEffect, useMemo, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import { matches } from 'mqtt-pattern';


interface IMqttMessage {
    topic: string;
    message?: string; 
}

export function useMqttSubscription(topic: string | Array<string>) {
    const topics = useMemo(() => Array.isArray(topic) ? topic : [topic], [topic]);
    const [message, setMessage] = useState<IMqttMessage>();
    const [subscribedTopics, setSubscribedTopics] = useState<Array<string>>([]);
    const [mqttMessage] = useWebSocket<{topic: string, message: string}, null>("message", "/mqtt");
    const [, subscribe] = useWebSocket<null, {topic: string | Array<string>}>("subscribe", "/mqtt");

    useEffect(() => {
        const topicsToSubscribe = topics.filter(item => subscribedTopics.includes(item) ? false : true);
        if (topicsToSubscribe.length > 0) {
            subscribe({topic: topicsToSubscribe});
            setSubscribedTopics([
                ...subscribedTopics,
                ...topicsToSubscribe,
            ]);
        }
    }, [topic, subscribe, setSubscribedTopics, subscribedTopics, topics])

    useEffect(() => {
        if (!mqttMessage || !mqttMessage?.topic) {
            return;
        }
        
        if (topics.flat().some(rTopic => matches(rTopic, mqttMessage.topic))) {
            setMessage(mqttMessage);
        }
    }, [mqttMessage, topics, setMessage]);
    
    return message;
}
