import { useWebSocket } from "./useWebSocket";


export function useMqttPublish() {
    const [publish] = useWebSocket<null, {topic: string, message: string}>(() => {}, "publish", "/mqtt");
    
    return (topic: string, message: string) => publish({topic, message});
}
