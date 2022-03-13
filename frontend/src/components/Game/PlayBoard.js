import Choose from "./Choose"
import Choosen from "./Choosen"
import "../style/Playboard.css"

export default function PlayBoard(props){
    return(
        <div className="playboard">
            {props.choose ? 
                <Choose 
                    sendChoosenItem={props.sendChoosenItem}
                /> : 
                <Choosen
                    item={props.item}
                    enemyItem={props.enemyItem}
                    playAgain={props.playAgain}
                    playerNr={props.playerNr}
                    name1={props.name1}
                    name2={props.name2}
                    win={props.win}
                    loose={props.loose}
                    draw={props.draw}
                    playAgainCount={props.playAgainCount}
                />
            }            
        </div>
    )
}