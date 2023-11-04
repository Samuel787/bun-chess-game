// import the packages

import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { v4 as uuidv4 } from 'uuid'
import { EventSource } from 'express-ts-sse'

const port = process.env.PORT || 3000;

const sse = new EventSource()

const app = express()

// Configure renderer
app.engine('html', engine({ defaultLayout: false }))
app.set('view engine', 'html')

// log incoming requests
app.use(morgan('combined'))

// serve files from static
app.use(express.static(__dirname + '/static'))

// POST /chess
app.post("/chess", express.urlencoded({ extended: true }), (req, resp) => {
    const gameId = uuidv4().substring(0, 8);
    const orientation = 'white';
    resp.status(200).render('chess', { gameId, orientation })
})

// PATCH /chess/:gameId
app.patch("/chess/:gameId", express.json(), (req, resp) => {
    // Get the gameId from the resource
    const gameId = req.params.gameId
    const move = req.body

    console.log(`GameId: ${gameId}: `, move)
    /**
     * note that SSE cannot send binary data. 
     * In other libraries, have to stringify the data before sending
     */
    sse.send({ event: gameId, data: move }) 

    resp.status(201).json({
        timestamp: (new Date()).getTime()
    })
})

// GET /chess?gameId=abcd
app.get("/chess", (req, resp) => {
    const gameId = req.query.gameId // the query.gameId comes from name attribute in html
    const orientation = 'black'
    resp.status(200).render('chess', { gameId, orientation })

})

// GET /chess/stream (in production we cannot do this. this will register to all incoming requests)
app.get("/chess/stream", sse.init)

app.listen(port, () => {
    console.info(`Application bound to port ${port} at ${new Date()}`)
})