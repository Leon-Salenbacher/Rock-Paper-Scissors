export default function GameMenu(props){
    return(
        <div>
            <h1>Searching for Players</h1>
            <h2>Spieler 1: {props.name1}</h2>
            <h2>Spieler 2: {props.name2}</h2>
            <h3>Game ID: {props.gameId}</h3>
            <button onClick={() => props.startGame()}>Start Game</button>
            <h1>{props.playerStart}/2</h1>
        </div>
    )
}