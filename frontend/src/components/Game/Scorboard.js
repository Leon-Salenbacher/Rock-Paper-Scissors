import "../style/Scorboard.css"

export default function Scorboard(props){
    return(
        <div className="scorboard-container">
            <div className="scorboard">
                <div className="scorboard-title">
                    <h3>ROCK</h3>
                    <h3>PAPER</h3>
                    <h3>SCISSORS</h3>
                </div>
                <div className="scorboard-display">
                    <h5>SCORE</h5>
                    <h1>{props.yourScore} - {props.enemyScore}</h1>
                </div>
            </div>
        </div>
    )
}