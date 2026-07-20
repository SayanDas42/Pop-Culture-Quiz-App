import './styles/startnewgame.css'
import { useNavigate } from "react-router";
function StartNewGame({onStartQuiz}){
    const navigate = useNavigate();
    return(
        <div className = "newgamebuttons">
        <button id = "newgamebutton" onClick={() => navigate("/quiz")}>Start New Singleplayer Game</button>
        <button id = "createroombutton" onClick={() => navigate("/createroom")}>Multiplayer (Coming Soon)</button>
        </div>
    )
}
export default StartNewGame