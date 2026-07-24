import { useEffect, useState, useRef } from "react";
import Nav from "/src/components/home/navbar/Nav.jsx";
import Question from "./Question"
import correctSound from "/src/assets/sounds/correct.mp3";
import wrongSound from "/src/assets/sounds/wrong.mp3";
function Quiz(){
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [data, setData] = useState(null);
    const [quizEnded, setQuizEnded] = useState(false);
    const [score, setScore] = useState(0);
    const [qInd, setQInd] = useState(0);
    const [numQuestions, setNumQuestions] = useState("0");

    const correctAudioRef = useRef(new Audio(correctSound));
    const wrongAudioRef = useRef(new Audio(wrongSound));

    useEffect(() => {
        if(data != null)
            return;
        fetch(`${API_BASE_URL}/room/singleplayer`,{method: "POST"})
        .then((response) => response.json())
        .then((json) => {
            setData(json);
            setNumQuestions(json.numQuestions);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
    }, []);

    async function nextQuestion(isCorrect){
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
                }
                else if(response.ok){
                    const result = await response.json();
                    setQInd(previousQInd => previousQInd + 1);
                    setData(result);
                }
                if(isCorrect)
                    setScore(previousScore => previousScore + 1);
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
                        nextQuestion(true);
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

    return(
        <>
        {
            quizEnded?(
                <div className = "quizend">
                    <h1 >Quiz Ended</h1>
                    <h1>Final Score : {score} / {numQuestions}</h1>
                </div>
            ):(
                data? (
                    <Question question = {data} checkAnswer = {checkAnswer} score = {score}
                    nextQuestion = {nextQuestion} qInd = {qInd} numQuestions = {numQuestions}/>
                ) : (
                    <p>Loading...</p>
                )
            )
        }
        </>
    )
}
export default Quiz