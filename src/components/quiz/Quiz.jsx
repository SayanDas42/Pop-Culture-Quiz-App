import { useEffect, useState, useRef } from "react";
import Nav from "/src/components/home/navbar/Nav.jsx";
import Question from "./Question"
import correctSound from "/src/assets/sounds/correct.m4a";
import wrongSound from "/src/assets/sounds/wrong.m4a";
function Quiz(){
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [data, setData] = useState(null);
    const [quizEnded, setQuizEnded] = useState(false);
    const [score, setScore] = useState(0);
    const [qInd, setQInd] = useState(0);
    const [numQuestions, setNumQuestions] = useState("0");
    const [correctAnswer,setCorrectAnswer] = useState(null);
    const savedRoomCode = sessionStorage.getItem("singlePlayerRoomCode");
    const [endTime, setEndTime] = useState(
        sessionStorage.getItem("endTime")
        );
    const timeGiven = 15;

    const correctAudioRef = useRef(new Audio(correctSound));
    const wrongAudioRef = useRef(new Audio(wrongSound));

    useEffect(() => {
        if(!savedRoomCode){
            fetch(`${API_BASE_URL}/room/singleplayer`,{method: "POST"})
            .then((response) => response.json())
            .then((json) => {
                setData(json);
                setNumQuestions(json.numQuestions);
                sessionStorage.setItem("singlePlayerRoomCode", json.roomCode);
                const newEndTime = Math.floor(Date.now() + timeGiven*1000)
                sessionStorage.setItem("endTime",newEndTime);
                setEndTime(newEndTime);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        }
        else{
            fetch(`${API_BASE_URL}/room/getroomsingleplayer/${savedRoomCode}`,{method: "GET"})
            .then((response) => response.json())
            .then((json) => {
                setData(json);
                setNumQuestions(json.numQuestions);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        }
        
    }, []);

    async function displayCorrectAnswer() {
        const response = await fetch(`${API_BASE_URL}/room/${data.roomCode}/getsingleplayeranswer`,
            {method:'GET'});
        if(response.ok){
            const answers = await response.json();
            setCorrectAnswer(answers[0]);
        }
    }

    async function nextQuestion(){
        const payload = {
                "roomCode": data.roomCode
            }
        const response = await fetch(`${API_BASE_URL}/room/nextquestion`,
            {method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
                });
                if(response.status === 204){
                    setQuizEnded(true)
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
                    sessionStorage.removeItem("singlePlayerRoomCode");
                    sessionStorage.removeItem("endTime");
                }
                else if(response.ok){
                    const result = await response.json();
                    setQInd(previousQInd => previousQInd + 1);
                    setData(result);
                    const newEndTime = Math.floor(Date.now() + timeGiven*1000)
                    sessionStorage.setItem("endTime",newEndTime);
                    setEndTime(newEndTime);
                }
            setCorrectAnswer(null);
        }

    async function checkAnswer(answer){
        if(answer != ""){
            const payload = {
                "roomCode": data.roomCode,
                "answer": answer.trim().toLowerCase()
            }
            const response = await fetch(`${API_BASE_URL}/room/checkanswer`,
                {method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
                });
                if(response.ok){
                    const result = await response.json();
                    if(result){
                        correctAudioRef.current.currentTime = 0;
                        correctAudioRef.current
                            .play()
                            .catch((error) => {
                                console.error(
                                    "Could not play sound:",
                                    error
                                );
                            });
                        setScore(previousScore => previousScore + 1);
                        displayCorrectAnswer();
                    }
                    else{
                       wrongAudioRef.current.currentTime = 0;
                        wrongAudioRef.current
                            .play()
                            .catch((error) => {
                                console.error(
                                    "Could not play sound:",
                                    error
                                );
                            }); 
                    }
                }
                else{
                    throw new Error(`Server returned status: ${response.status}`);
                }
        }
    }

    async function playAgain(){
        setQuizEnded(false);
        setData(null);
        setScore(0);
        setQInd(0);
        setNumQuestions("0");
        await fetch(`${API_BASE_URL}/room/singleplayer`,{method: "POST"})
            .then((response) => response.json())
            .then((json) => {
                setData(json);
                setNumQuestions(json.numQuestions);
                sessionStorage.setItem("singlePlayerRoomCode", json.roomCode);
                const newEndTime = Math.floor(Date.now() + timeGiven*1000)
                sessionStorage.setItem("endTime",newEndTime);
                setEndTime(newEndTime);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
        });
    }

    return(
        <>
        {
            quizEnded?(
                <div className = "quizendsp">
                    <h1 >Quiz Ended</h1>
                    <h1>Final Score : {score} / {numQuestions}</h1>
                    <button id = "playagainbutton" onClick={playAgain}>Play Again</button>
                </div>
            ):(
                data? (
                    <Question question = {data} checkAnswer = {checkAnswer} score = {score} correctAnswer = {correctAnswer}
                    displayCorrectAnswer = {displayCorrectAnswer} nextQuestion = {nextQuestion} qInd = {qInd} numQuestions = {numQuestions} 
                    endTime = {endTime}/>
                ) : (
                    <p>Loading...</p>
                )
            )
        }
        </>
    )
}
export default Quiz