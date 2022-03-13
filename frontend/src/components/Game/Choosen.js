import paper from "./img/paper.png"
import scissors from "./img/scissors.png"
import rock from "./img/rock.png"
import "../style/Choosen.css"
import { useState } from "react"

export default function Choosen(props){
    function loadItem(input){
        //1: rock; 2: paper; 3: scissors
        let item = null
        if(input === 1){
            //rock
            item = (<div className="choosen-rock">
                            <div className="choosen-rock-item">
                            </div>
                            <img src={rock} className="choosen-rock-img" />
                        </div>)
        }else if(input === 2){
            //paper
            item = (<div className="choosen-paper">
                            <div className="choosen-paper-item">
                            </div>
                            <img src={paper} className="choosen-paper-img" />
                        </div>)
        }else if(input === 3){
            //scissors  
            item = (<div className="choosen-scissors">
                            <div className="choosen-scissors-item">
                            </div>
                            <img src={scissors} className="choosen-scissors-img" />
                        </div>)
        }
        return item
    }

    function loadName(e){
        if(props.playerNr === 1){
            if(e === 1) return props.name1
            if(e === 2) return props.name2
        }else{
            if(e === 1) return props.name2
            if(e === 2) return props.name1
        }
    }

    return(
        <div className="choosen-container">            
            <div className="choosen">
                <div className="choosen-player1">
                    <h1 className="name">{loadName(1)}<br />Picked</h1>
                    {loadItem(props.item)}
                </div>
                <div className="choosen-display">
                    <h1>    
                        {
                            props.win ? "win" :
                            props.loose ? "loose" :
                            props.draw ? "draw" :
                            "Enemy is Choosing"
                        }
                    </h1>
                    <button className="reset-button" onClick={() => props.playAgain()}>Play Again {props.playAgainCount}/2</button>
                </div>
                <div className="choosen-player2">
                    <h1 className="name">{loadName(2)}<br />Picked</h1>
                    {loadItem(props.enemyItem)}
                </div>
            </div>
        </div>
    )
}