import HowToPlay from "./HowToPlay"
import StartNewGame from "./StartNewGame"
import './styles/main.css'
function Main({onStartQuiz}){
    return(
        <>
            <div className = "main">
            <HowToPlay/>
            <StartNewGame onStartQuiz = {onStartQuiz}/>
            </div>
        </>
    )
}
export default Main