import './styles/startnewgame.css'
import { useNavigate } from "react-router";
function StartNewGame({onStartQuiz}){
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    async function newGame() {
        const savedRoomCode = sessionStorage.getItem("singlePlayerRoomCode");

        if (savedRoomCode) {
            sessionStorage.removeItem("singlePlayerRoomCode");
            sessionStorage.removeItem("endTime");

            try {
                await fetch(`${API_BASE_URL}/room/${savedRoomCode}`, {
                    method: "DELETE"
                });
            } catch (error) {
                console.error("Error deleting room:", error);
            }
        }

        navigate("/quiz");
    }

    return(
        <div className = "newgamebuttons">
        <button id = "newgamebutton" onClick={newGame}>Start New Singleplayer Game</button>
        <button id = "createroombutton" onClick={() => navigate("/createroom")}>Start New Multiplayer Game</button>
        </div>
    )
}
export default StartNewGame