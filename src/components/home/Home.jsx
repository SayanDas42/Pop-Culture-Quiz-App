import Nav from './navbar/Nav.jsx'
import Main from './main/Main.jsx'
import { useEffect } from 'react';
function Home(){
    useEffect(() => {
        const deleteSinglePlayerRoom = async () => {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
        }
    deleteSinglePlayerRoom();},[])
    return(
        <>
            <Main/>
        </>
    )
}
export default Home