import { Routes, Route } from "react-router";
import Quiz from './components/quiz/Quiz.jsx'
import Home from './components/home/Home.jsx'
import Nav from './components/home/navbar/Nav.jsx'
import CreateRoom from './components/room/CreateRoom.jsx'
import Lobby from './components/room/Lobby.jsx'
import { useState } from "react";
function App(){
    return(
      <>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/createroom" element={<CreateRoom />} />
        <Route path="/room/:roomCode" element={<Lobby />} />
      </Routes>
    </>
    )
}
export default App