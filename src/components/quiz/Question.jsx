import { useState, useEffect } from "react";
import "./styles/question.css"
function Question({question,checkAnswer,nextQuestion,score,qInd,numQuestions,endTime}){

    const [time, setTime] = useState(null);

    useEffect(() => {
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

        nextQuestion(false);
        }
    }, 0);

    return () => clearInterval(timer);
    }, [question.question, endTime]);

    return(
        <>
            <div id = "timer">
                <h2>Time Remaining : {time}</h2>
            </div>
            <div className = "questionblock">
                <div className = "qanda">
                    <div className = "question">
                        <h2 id = "ques">{question.question}</h2>
                        <div className="qDetail">
                        {
                            question.imageID?
                            <img id = "qImg" src = {`/src/assets/images/${question.imageID}.jpg`}></img>:
                            <h1 id = "qQuote">{question.quote}</h1>
                        }
                        </div>
                    </div>
                    <div>
                        <input id = "answerbox" type ="text" placeholder="Type your answer" autoComplete = "off" 
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const val = e.target.value;
                                e.target.value = "";
                            checkAnswer(val);
                            }
                        }}></input>
                    </div>
                </div>
                <div className = "Score">
                    <h1>Score : {score} / {numQuestions}</h1>
                </div>
            </div>
        </>
    )
}

export default Question