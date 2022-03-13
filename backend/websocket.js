const http = require("http")
const { connection } = require("websocket")
const websocketServer = require("websocket").server
const httpServer = http.createServer()
httpServer.listen(9090, () => console.log("Listening.. on 9090"))
//hashmap
const clients = {}
const games = {}
const wsServer = new websocketServer({
    "httpServer": httpServer
})

wsServer.on("request", request => {
    //connect
    const connection = request.accept(null, request.origin)
    connection.on("open", () => console.log("opened!"))
    connection.on("close", () => console.log("closed!"))
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)
        console.log("I received a message from Client")
        
        //create a game
        if(result.method === "create"){
            const clientId = result.clientId
            const gameId = guid()

            games[gameId] = {
                "id": gameId,
                "clients": [],
                "score": [0, 0],
                "item": [null, null],
                "playerWantStart": [false, false],
                "playerWantsPlayAgain": [false, false],
                "gameStarted": false,
                "playAgain": false
            }
            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }
            const con = clients[clientId].connection
            con.send(JSON.stringify(payLoad))
        }

        //join a game
        if(result.method === "join"){
            const clientId = result.clientId
            const gameId = result.gameId
            const game = games[gameId]
            const name = result.name

            if(game.clients.length >= 2){
                //max players reached
                return 
            } 
            const playerNr = {"0": 1, "1": 2}[game.clients.length]
            game.clients.push({
                "clientId": clientId,
                "playerNr": playerNr,
                "name": name,
                "win": false,
                "loose": false,
                "draw": false
            })

            //start the game if 2 players are in
            //if(game.clients.length === 2) console.log("start game")
            const payLoad = {
                "method": "join",
                "game": game
            }
            //loop through all clients and tell them taht people has joined
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
        }

        //Player wants to start 
        if(result.method === "startGame"){
            const gameId = result.gameId
            const game = games[gameId]
            const playerNr = result.playerNr
            game.playerWantStart[playerNr-1] = !game.playerWantStart[playerNr-1]
            if(game.playerWantStart[0] && game.playerWantStart[1]) game.gameStarted = true
            const payLoad = {
                "method": "update",
                "game": game
            }
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
        }

        //Player wants to playAgain
        if(result.method === "playAgain"){
            const gameId = result.gameId
            const game = games[gameId]
            const playerNr = result.playerNr
            game.playerWantsPlayAgain[playerNr-1] = !game.playerWantsPlayAgain[playerNr-1]
            if(game.playerWantsPlayAgain[0] && game.playerWantsPlayAgain[1]){
                game.playAgain = true
                game.item = [null, null]
                //game.clients.forEach(c => {
                //    game.clients[c.clientId].win = false
                //    game.clients[c.clientId].loose = false
                //    game.clients[c.clientId].draw = false
                //})
                for(let i = 0; i < game.clients.length; i++){
                    game.clients[i].win = false
                    game.clients[i].loose = false
                    game.clients[i].draw = false
                }
                game.playerWantsPlayAgain[0] = false
                game.playerWantsPlayAgain[1] = false
            }
            const payLoad = {
                "method": "update",
                "game": game
            }
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
            game.playAgain = false
        }

        //player Choose Item
        if(result.method === "itemChoosed"){
            const gameId = result.gameId
            const game = games[gameId]
            const playerNr = result.playerNr
            if(!game.item[playerNr-1]) game.item[playerNr-1] = result.item
            //1: rock; 2: paper; 3: scissors
            if(game.item[0] && game.item[1]){
                if((game.item[0] === 1 &&  game.item[1] === 3) || (game.item[0] === 2 &&  game.item[1] === 1) || (game.item[0] === 3 &&  game.item[1] === 2)){
                    game.clients[0].win = true
                    game.clients[1].loose = true
                    game.score[0] = game.score[0] + 1
                }else if((game.item[1] === 1 &&  game.item[0] === 3) || (game.item[1] === 2 &&  game.item[0] === 1) || (game.item[1] === 3 &&  game.item[0] === 2)){
                    game.clients[1].win = true
                    game.clients[0].loose = true
                    game.score[1] = game.score[1] + 1
                }else{
                    game.clients[1].draw = true
                    game.clients[0].draw = true
                }
            }
            const payLoad = {
                "method": "update",
                "game": game
            }
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
        }
    })

    //generate a new clientId
    const clientId = guid()
    clients[clientId] = {
        "connection": connection
    }
    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    connection.send(JSON.stringify(payLoad))
})

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();