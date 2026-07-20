import { useNavigate} from "react-router";
import HowToPlayMultiplayer from "./HowToPlayMultiplayer.jsx";
import "./styles/createroom.css"
import { useState } from "react";
function CreateRoom(){
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();
    const[showPopupHost, setShowPopupHost] = useState(false);
    const[showPopupJoin, setShowPopupJoin] = useState(false);

    function hostRoom(){
        const name = document.getElementById("namebox").value;
        if(name.trim() == ""){
            alert("Please enter your beautiful name.")
        }
        else{
            fetch(`${API_BASE_URL}/room/hostroom/${name}`, {
                method: "POST"
            })
                .then((response) => response.json())
                .then((data) => {
                sessionStorage.setItem(
                    `playerId:${data.roomCode}`,
                    data.hostPlayerId
                );
                navigate(`/room/${data.roomCode}`);
                })
                .catch((error) => {
                console.error("Error creating room:", error);
                });
        }
    }

    function joinRoom(){
        const name = document.getElementById("namebox").value;
        if(name.trim() == ""){
            alert("Please enter your beautiful name.")
        }
        else{
            const roomCode = document.getElementById("roomcodebox").value;
            if(roomCode.trim() == ""){
                alert("Please enter a room code.")
            }
            else{
                fetch(`${API_BASE_URL}/room/joinroom/${roomCode}/${name}`, {
                    method: "POST"
                })
                    .then((response) => response.json())
                    .then((data) => {navigate(`/room/${data.roomCode}`)})
                    .catch((error) => {
                    console.error("Room Not Found:", error);
                    });
            }
        }
    }

    return(
        <div className="room-window">
            <HowToPlayMultiplayer/>
            <div className="hostorjoinroom">
                <div className="hostroom">
                    <button className="hostroombutton" onClick={() => {setShowPopupHost(true)}}>Host Room</button>
                </div>
                <div className="joinroom">
                    <button className="joinroombutton" onClick={() => {setShowPopupJoin(true)}}>Join Room</button>
                </div>
            </div>
            {showPopupHost &&(
                <div className = "popupoverlay">
                    <div className = "popupbox">
                        <input id = "namebox" type = "text" placeholder="Type your name"></input>
                        <button className="hostroombutton" onClick={hostRoom}>Host</button>
                        <button onClick={() => setShowPopupHost(false)}>Close</button>
                    </div>
                </div>
            )}
            {showPopupJoin &&(
                <div className = "popupoverlay">
                    <div className = "popupbox">
                        <input id = "namebox" type = "text" placeholder="Type your name"></input>
                        <input id = "roomcodebox" type = "text" placeholder="Type a room code"></input>
                        <button className="joinroombutton" onClick={joinRoom}>Join</button>
                        <button onClick={() => setShowPopupJoin(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default CreateRoom;