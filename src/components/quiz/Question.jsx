import { useState, useRef, useEffect } from "react";
import "./styles/question.css"
function Question({question,checkAnswer,correctAnswer,displayCorrectAnswer,nextQuestion,score,qInd,
    numQuestions,endTime}){

    const [time, setTime] = useState(null);

    const [userAnswer, setAnswer] = useState("");
    const answerInputRef = useRef(null);

    useEffect(() => {
        setAnswer("");

        if (answerInputRef.current) {
            answerInputRef.current.focus();
        }
        }, [question.question]);

    useEffect(() => {
        if (correctAnswer) {
            const timeout = setTimeout(() => {
                nextQuestion();
            }, 5000);
            return () => clearTimeout(timeout);
        }
        else{
            if (!endTime) return;
            const timer = setInterval(() => {
            const remaining = Math.max(
            0,
            Math.ceil((endTime - Date.now()) / 1000)
            );

            setTime(remaining);

            if (remaining <= 0) {
            clearInterval(timer);

            const input = document.getElementById("answerbox");
            if (input) {
                input.value = "";
            }
            displayCorrectAnswer();
            }
        }, 25);

        return () => clearInterval(timer);
        }
    }, [question.question, endTime, correctAnswer]);

    function formatAnswer(answer) {
        return answer
            .split(" ")
            .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
        }

    if(correctAnswer){
        return(
            <>
             <div className = "questionblock">
                <div className = "qanda">
                    <div className = "question">
                        <h2 id = "ques">{question.question}</h2>
                        <div className="qDetail">
                        <h1 id = "qQuote">The correct answer was<br></br><br></br>"{formatAnswer(correctAnswer)}"</h1>
                        </div>
                    </div>
                    <div>
                        <input key = "answered" id = "answered" type = "text" value = "Ready for next question?" disabled readOnly></input>
                    </div>
                </div>
                <div className = "timerandscore">
                    <div  id = "timer" >
                        <h2>Time Remaining : 0</h2>
                    </div>
                    <div id = "score" >
                        <h1>Score : {score} / {numQuestions}</h1>
                    </div>
                </div>
            </div>
        </>
        )
    }
    else{
        return(
            <>
                <div className = "questionblock">
                    <div className = "qanda">
                        <div className = "question">
                            <h2 id = "ques">{question.question}</h2>
                            <div className="qDetail">
                            {
                                question.imageID?
                                <img id = "qImg" src = {`${import.meta.env.VITE_IMAGE_BASE_URL}/${question.imageID}.jpg`}></img>:
                                <h1 id = "qQuote">{question.quote}</h1>
                            }
                            </div>
                        </div>
                        <div>
                            <input ref={answerInputRef} id = "answerbox" type ="text" placeholder="Type your answer" autoComplete = "off" 
                            value={userAnswer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const val = userAnswer.trim();
                                    if (val === "") return;
                                    setAnswer("");
                                    checkAnswer(val);
                                }
                            }}></input>
                        </div>
                        <div>
                            <button id = "skip" onClick={displayCorrectAnswer}><b>&#128683; Skip Question</b></button>
                        </div>
                    </div>
                    <div className = "timerandscore">
                        <div  id = "timer" >
                            <h2>Time Remaining : {time}</h2>
                        </div>
                        <div id = "score" >
                            <h1>Score : {score} / {numQuestions}</h1>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Question