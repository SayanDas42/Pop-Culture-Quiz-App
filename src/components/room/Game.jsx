import "./styles/game.css"
import { useNavigate} from "react-router";
import { useState,useRef,useEffect } from "react";
import { Client } from "@stomp/stompjs"
function Game({game,clientRef,timeLeft,answer,returnToLobby}){

    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const playerId = sessionStorage.getItem(`playerId:${game.roomCode}`);
    const correctlyAnsweredPlayers = new Set(game.correctlyAnsweredPlayers);

    function checkAnswer(answer){
        const payload = {
            roomCode: game.roomCode,
            playerId: playerId,
            answer: answer.trim().toLowerCase()
        };

        clientRef.current.publish({
            destination: "/app/game/answer",
            body: JSON.stringify(payload)
        });
    }

    function formatAnswer(answer) {
        return answer
            .split(" ")
            .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
        }

    if(answer != null){
        return(
            <div className = "game">
                <div className = "questionblock">
                    <div className = "qanda">
                        <div className = "question">
                            <h2 id = "ques">{game.question}</h2>
                            <div className="qDetail">
                            <h1 id = "qQuote">The correct answer was<br></br><br></br>"{formatAnswer(answer[0])}"</h1>
                            </div>
                        </div>
                        <div>
                            {correctlyAnsweredPlayers.has(playerId)?
                                <input key = "answered" id = "answered" type = "text" value = "Correct Answer" disabled readOnly></input>:
                                <input key = "answerbox" id = "answerbox" type ="text" placeholder="Type your answer" autoComplete = "off" 
                                disabled={timeLeft === 0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const val = e.target.value;
                                        e.target.value = "";
                                    checkAnswer(val);
                                    }
                                }}></input>
                        }
                        </div>
                    </div>
                </div>
                <div className = "timerandplayerlist">
                    <div className = "playerlist">
                        {game.playerList.map((player) => (
                            <div id = "player"
                                key={player.playerId}
                                className={player.playerId === playerId ? "currentPlayer" : "otherPlayer"}
                                >
                                <h3>{player.playerName}</h3>
                                <p>{player.score}</p>
                            </div>
                        ))}    
                    </div>
                </div>
            </div>
        )
    }
    else if(game != null){
        return (
            <>
            {game.question == ""?
                <div className = "quizendandstandings">
                    <div className = "quizend">
                        <h1>Quiz Ended</h1>
                        <button id = "returntolobbybutton" onClick={returnToLobby}>Return To Lobby</button>
                    </div>
                    <div className = "playerlist">
                        <h1>Standings</h1>
                        {game.playerList.map((player) => (
                                <div id = "player"
                                    key={player.playerId}
                                    className={player.playerId === playerId ? "currentPlayer" : "otherPlayer"}
                                    >
                                    <h3>{player.playerName}</h3>
                                    <p>{player.score}</p>
                                </div>
                            ))}
                    </div>
                </div>:
                <div className = "game">
                <div className = "questionblock">
                    <div className = "qanda">
                        <div className = "question">
                            <h2 id = "ques">{game.question}</h2>
                            <div className="qDetail">
                            {
                                game.imageID?
                                <img id = "qImg" src = {`/src/assets/images/${game.imageID}.jpg`}></img>:
                                <h1 id = "qQuote">{game.quote}</h1>
                            }
                            </div>
                        </div>
                        <div>
                            {correctlyAnsweredPlayers.has(playerId)?
                                <input key = "answered" id = "answered" type = "text" value = "Correct Answer" disabled readOnly></input>:
                                <input key = "answerbox" id = "answerbox" type ="text" placeholder="Type your answer" autoComplete = "off" 
                                disabled={timeLeft === 0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const val = e.target.value;
                                        e.target.value = "";
                                    checkAnswer(val);
                                    }
                                }}></input>
                        }
                        </div>
                    </div>
                </div>
                <div className = "timerandplayerlist">
                    <div id = "multiplayertimer">
                        <h2>Time Remaining : {timeLeft}</h2>
                    </div>
                    <div className = "playerlist">
                        {game.playerList.map((player) => (
                            <div id = "player"
                                key={player.playerId}
                                className={player.playerId === playerId ? "currentPlayer" : "otherPlayer"}
                                >
                                <h3>{player.playerName}</h3>
                                <p>{player.score}</p>
                            </div>
                        ))}    
                    </div>
                </div>
            </div>
            }
            </>
        )
    }
    else{
        return(
            <h1>Loading Quiz...</h1>
        )
    }
}
export default Game