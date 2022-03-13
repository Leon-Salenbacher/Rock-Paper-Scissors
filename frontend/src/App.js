import { useState } from "react"
import MainMenu from "./components/Menu/MainMenu"
import GameMenu from "./components/Menu/GameMenu"
import GameBoard from "./components/Game/GameBoard"

let clientId = null
let gameId = null
let playerNr = null

export default function App(){
    const ws = new WebSocket("ws://localhost:9090")
    
    //Game state
    const [inGame, setInGame] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [choose, setChoose] = useState(true)
    //variables
    const [joinInput, setJoinInput] = useState("")
    const [nameInput, setNameInput] = useState("")
    //name
    const [name1, setName1] = useState("")
    const [name2, setName2] = useState("")
    //Score
    const [yourScore, setYourScore] = useState(0)
    const [enemyScore, setEnemyScore] = useState(0)
    //items
    const [enemyItem, setEnemyItem] = useState(null)
    const [item, setItem]= useState(null)
    //loose/win
    const [loose, setLoose] = useState(false)
    const [win, setWin] = useState(false)
    const [draw, setDraw] = useState(false)
    //Player who wants to start/play Again
    const [playerStart, setPlayerStart] = useState(0)
    const [playAgainCount, setPlayAgainCount] = useState(0)

    //webSocket
    ws.onmessage = message => {
        const response = JSON.parse(message.data)
        //connect
        if(response.method === "connect" && !clientId){
            clientId = response.clientId
            console.log("Client id Set successfully " + clientId)
        }
        //create game
        if(response.method === "create"){
            gameId = response.game.id
            console.log("game successfully created with id " + gameId)
        }
        //join game
        if(response.method === "join"){
            const game = response.game
            game.clients.forEach(c => {
                console.log("client joined Game with ID " + c.clientId)
                if(c.clientId === clientId) playerNr = c.playerNr
                if(c.playerNr === 1) setName1(c.name)
                if(c.playerNr === 2) setName2(c.name)
            });
            if(game.playerWantStart[0] && game.playerWantStart[1]) setPlayerStart(2)
            else if(game.playerWantStart[0] || game.playerWantStart[1]) setPlayerStart(1)
            else setPlayerStart(0)
            if(game.gameStarted) setGameStarted(true)
            setInGame(true)
        }
        //update Game
        if(response.method === "update"){
            const game = response.game
            console.log(game)
            if(game.playerWantStart[0] && game.playerWantStart[1]) setPlayerStart(2)
            else if(game.playerWantStart[0] || game.playerWantStart[1]) setPlayerStart(1)
            else setPlayerStart(0)
            if(game.playerWantsPlayAgain[0] && game.playerWantsPlayAgain[1]) setPlayAgainCount(2)
            else if(game.playerWantsPlayAgain[0] || game.playerWantsPlayAgain[1])setPlayAgainCount(1)
            else setPlayAgainCount(0)

            if(game.gameStarted) setGameStarted(true)
            //if(game.playerWantsPlayAgain[0] && game.playerWantsPlayAgain[1]) setChoose(true)
            if(game.playAgain) setChoose(true)
            //if(game.item[0] && game.item[1]){
            let e = 0
            game.item.forEach(i => {
                if(e === playerNr-1){
                    setItem(i)
                    setYourScore(game.score[e])
                    setLoose(game.clients[e].loose)
                    setWin(game.clients[e].win)
                    setDraw(game.clients[e].draw)
                }else{
                    setEnemyItem(i)
                    setEnemyScore(game.score[e])
                } 
                e++
            })
            //}

        }
    }

    //functions
    function create(){
        //create game
        if(gameId === null){
            //get value of text field
            gameId = joinInput
        }
        const payLoad = {
            "method": "create",
            "clientId": clientId
        }
        ws.send(JSON.stringify(payLoad))
    }

    function join(){
        //join game
        if(gameId === null){
            gameId = joinInput
        }
        const payLoad = {
            "method": "join",
            "clientId": clientId,
            "gameId": gameId,
            "name": nameInput
        }
        ws.send(JSON.stringify(payLoad))
    } 

    //vote for gameStart
    function startGame(){
        //send start
        const payLoad = {
            "method": "startGame",
            "clientId": clientId,
            "playerNr": playerNr,
            "gameId": gameId
        }
        ws.send(JSON.stringify(payLoad))
    }

    //tell websocket which Item you choosed
    function sendChoosenItem(item){
        setChoose(false)
        setItem(item)
        const payLoad = {
            "method": "itemChoosed",
            "item": item,
            "clientId": clientId,
            "playerNr": playerNr,
            "gameId": gameId
        }
        ws.send(JSON.stringify(payLoad))
    }

    function playAgain(){
        console.log("playAgain")
        const payLoad = {
            "method": "playAgain",
            "playerNr": playerNr,
            "gameId": gameId
        }
        ws.send(JSON.stringify(payLoad))
    }

    return(
        <div>
            {gameStarted ?
                <GameBoard 
                    name1={name1}
                    name2={name2}
                    yourScore={yourScore}
                    enemyScore={enemyScore}
                    enemyItem={enemyItem}
                    item={item}
                    loose={loose}
                    win={win}
                    draw={draw}
                    sendChoosenItem={sendChoosenItem}
                    choose={choose}
                    playerNr={playerNr}
                    playAgain={playAgain}
                    playAgainCount={playAgainCount}
                /> :
            inGame ? 
                <GameMenu
                    name1={name1}
                    name2={name2}
                    startGame={startGame}
                    gameId={gameId}
                    playerStart={playerStart}
                /> : 
            
                <MainMenu 
                    createGame={create}
                    joinGame={join}
                    setJoinInput={setJoinInput}
                    joinInput={joinInput}
                    setNameInput={setNameInput}
                    nameInput={nameInput}
                />
            }
        </div>
    )
}