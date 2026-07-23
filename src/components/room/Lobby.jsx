import { useState,useRef,useEffect } from "react";
import { useParams } from "react-router"
import { Client } from "@stomp/stompjs"
import Game from "./Game";
import "./styles/lobby.css"
function Lobby(){
    const {roomCode} = useParams();
    const[roomData,setRoomData] = useState(null);
    const[playerList,setPlayerList] = useState(null);
    const[gameStarted, setGameStarted] = useState(false);
    const[game,setGame] = useState(null);
    const clientRef = useRef(null);

    const playerId = sessionStorage.getItem(`playerId:${roomCode}`);

    const isHost = roomData !== null && roomData.hostPlayerId === playerId;

    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previousTime) => previousTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/room/${roomCode}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Could not load room");
                }

                return response.json();
            })
            .then(async (data) => {
                setRoomData(data);
                setPlayerList(data.playerList)
                if (data.status === "GAME IN PROGRESS") {
                    const gameResponse = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/room/${roomCode}/game`
                    );

                    if (!gameResponse.ok) {
                    throw new Error("Could not load game");
                    }

                    const gameData = await gameResponse.json();

                    setGame(gameData);
                    setTimeLeft(gameData.endsAt - Math.floor(Date.now() / 1000));
                    setGameStarted(true);
                }
            })
            .catch(console.error);
    }, [roomCode]);

    useEffect(() => {
        const client = new Client({
            brokerURL: import.meta.env.VITE_API_BASE_URL_WS,
            reconnectDelay: 5000,
            onConnect: () => {
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

    useEffect(() => {
        const client = new Client({
            brokerURL: import.meta.env.VITE_API_BASE_URL_WS,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/game/${roomCode}`, (message) => {
                    const updatedGame = JSON.parse(message.body);
                    setGame(updatedGame);
                    setTimeLeft(updatedGame.endsAt - Math.floor(Date.now() / 1000));
                    setGameStarted(true);
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
    },[roomCode])

    function startGame(){
        fetch(`${import.meta.env.VITE_API_BASE_URL}/room/${roomCode}/startgame`,{method: "POST"});
    }

    if(gameStarted == true){
        return <Game game = {game} clientRef = {clientRef} timeLeft = {timeLeft} isHost = {isHost}/>
    }

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
                {isHost && (roomData.status === "ACTIVE" || roomData.status === "GAME IN PROGRESS") && (
                    <button id="startgamebutton" onClick = {startGame}>
                        Start Game
                    </button>
                    )}
            </div>
            <div className="playersjoinedlist">
                <h2>Players Joined</h2>

                {playerList.map((player) => (
                    <div key={player.playerId}>
                        <h3>{player.playerName}</h3>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Lobby