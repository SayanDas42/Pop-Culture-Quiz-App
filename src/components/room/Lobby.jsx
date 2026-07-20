import { useState,useRef,useEffect } from "react";
import { useParams } from "react-router"
import { Client } from "@stomp/stompjs"
import MultiplayerQuiz from "./MultiplayerQuiz";
import "./styles/lobby.css"
function Lobby(){
    const {roomCode} = useParams();
    const[roomData,setRoomData] = useState(null);
    const[playerList,setPlayerList] = useState(null);
    const clientRef = useRef(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/room/${roomCode}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Could not load room");
                }

                return response.json();
            })
            .then((data) => {
                setRoomData(data);
                setPlayerList(data.players)
            })
            .catch(console.error);
    }, [roomCode]);

    useEffect(() => {
        const client = new Client({
            brokerURL: import.meta.env.VITE_API_BASE_URL_WS,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");
                client.subscribe(`/topic/rooms/${roomCode}`, (message) => {
                    const data = JSON.parse(message.body);
                    setRoomData(data);
                    setPlayerList(data.playerList);
                });
            },
            onStompError: (frame) => {
                console.error("STOMP error:", frame.headers.message);
            },
        });
        client.activate();
        clientRef.current = client;
        return () => {
            client.deactivate();
        };
    }, [roomCode]);

    if (roomData === null) {
        return (
            <div className="lobbymain">
                <h1>Room Code: {roomCode}</h1>
                <p>Loading room...</p>
            </div>
        );
    }
    return(
        <div className = "lobbymain">
            <div className = "roomdetails">
                <h1>Room Code : {roomCode}</h1>
            </div>
            <div className="playersjoinedlist">
                <h2>Players Joined</h2>

                {playerList.map((player) => (
                    <div key={player.playerId}>
                        {player.playerName}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Lobby