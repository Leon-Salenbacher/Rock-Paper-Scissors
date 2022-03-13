import paper from "./img/paper.png"
import rock from "./img/rock.png"
import scissors from "./img/scissors.png"
import "../style/Choose.css"

export default function Choose(props){
    //1: rock; 2: paper; 3: scissors
    return(
        <div>        
            <div className="choose">
                <div className="items">
                    <div className="item-top">
                        <div className="paper" onClick={() => props.sendChoosenItem(2)}>
                            <div className="paper-item">
                            </div>
                            <img src={paper} className="paper-img" />
                        </div>
                        <div className="scissors" onClick={() => props.sendChoosenItem(3)}>
                            <div className="scissors-item">
                            </div>
                            <img src={scissors} className="scissors-img" />
                        </div>
                    </div>
                    <div className="item-bottom">
                        <div className="rock" onClick={() => props.sendChoosenItem(1)}>
                            <div className="rock-item">
                            </div>
                            <img src={rock} className="rock-img" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}