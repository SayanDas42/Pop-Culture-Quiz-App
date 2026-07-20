import { useState, useEffect } from "react";
import "./styles/question.css"
function Question({question,checkAnswer,nextQuestion,score,qInd,numQuestions}){

    const[time,setTime] = useState(9);

    useEffect(() => {
        setTime(9)
        const timer = setInterval(() => {
            setTime((previousTime) => {
            if (previousTime <= 0) {
                clearInterval(timer);
                document.getElementById("answerbox").value = "";
                nextQuestion(false);
                return 0;
            }
            return previousTime - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
        },[qInd]);

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