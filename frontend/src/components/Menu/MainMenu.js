export default function MainMenu(props){
    return(
        <div>
            <button onClick={props.createGame} id="btnCreate">Create Game</button>
            <button onClick={props.joinGame} id="btnJoin">Join Game</button>
            <input
                type="text"
                id="txtGameId"
                value={props.joinInput}
                onChange={(e) => props.setJoinInput(e.target.value)}
                placeholder="Enter gameID"
            />
            <input 
                type="text"
                id="txtName"
                value={props.nameInput}
                onChange={(e) => props.setNameInput(e.target.value)}
                placeholder="Enter your name"
            />
        </div>
    )
}