import './styles/leaveroom.css'
import leaveroom from "/src/assets/leaveroom.png";
function LeaveRoom({setShowLeaveRoomPopup}){
    return(
        <>
            <img title = "Leave Room" id = "leaveroom" src = {leaveroom} alt="Leave Room" onClick={() => setShowLeaveRoomPopup(true)}></img>
        </>
    )
}
export default LeaveRoom