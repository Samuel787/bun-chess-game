// Access <body>
const body = document.querySelector("body")

// Access the data attribute
const gameId = body.dataset.gameid
const orientation = body.dataset.orientation

console.log("gameid: " + gameId)
console.log("orientation: " + orientation)

// Handle onDrop
const onDrop = (src, dest, piece) => {
    console.info(`src=${src}, dst=${dest}, piece=${piece}`)

    // Constuct the move
    const move = { src, dest, piece }

    // send player's move to server 
    // PATCH /chess/:gameId
    fetch(`/chess/${gameId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(move)
    })
    .then(resp => console.info("Response: ", resp))
    .catch(err => console.error("Error: ", err))
}

// Create config file for chess
const config = {
    draggable: true,
    position: "start",
    orientation,
    onDrop
}

// Create instance of chess game
const chess = Chessboard("chess", config)

// Create an SSE connection
const sse = new EventSource("/chess/stream")
