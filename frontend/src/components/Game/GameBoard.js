import Scorboard from "./Scorboard"
import PlayBoard from "./PlayBoard"

export default function GameBoard(props){
    return(
        <div>
            <Scorboard 
                yourScore={props.yourScore}
                enemyScore={props.enemyScore}
            />
            <PlayBoard 
                sendChoosenItem={props.sendChoosenItem}
                name1={props.name1}
                name2={props.name2}
                enemyItem={props.enemyItem}
                item={props.item}
                loose={props.loose}
                win={props.win}
                draw={props.draw}
                choose={props.choose}
                playAgain={props.playAgain}
                playerNr={props.playerNr}
                playAgainCount={props.playAgainCount}
            />
        </div>
    )
}