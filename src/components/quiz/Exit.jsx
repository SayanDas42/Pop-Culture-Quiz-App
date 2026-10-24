import './styles/exit.css'
import exit from "/src/assets/leaveroom.png";
function Exit({setShowExitPopup}){
    return(
        <>
            <img title = "Exit" id = "exit" src = {exit} alt="Exit" onClick = {() => {setShowExitPopup(true)}}></img>
        </>
    )
}
export default Exit