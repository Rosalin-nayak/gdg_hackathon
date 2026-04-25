require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

const incidentRoutes = require('./routes/incidentsRoutes')
app.use('/incidents', incidentRoutes)

const cameraRoutes = require('./routes/cameraRoutes')
app.use('/cameras', cameraRoutes)

const responderRoutes = require('./routes/respondersRoutes')
app.use('/responders', responderRoutes)

const alertRoutes = require('./routes/alertsRoutes')
app.use('/alerts', alertRoutes)

app.get('/test', (req, res) => {
    res.json({ message: "Hello World!" })
})

const { initSocket } = require('./sockets/socketServer')
initSocket(server)

const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})