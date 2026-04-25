const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const incidentRoutes = require('./routes/incidentsRoutes');
app.use('/incidents', incidentRoutes);

const cameraRoutes = require('./routes/cameraRoutes');
app.use('/cameras', cameraRoutes);

const responderRoutes = require('./routes/respondersRoutes');
app.use('/responders', responderRoutes);

app.post('/incidents', (req, res) => {
    const { title, description, location } = req.body
    console.log('Received incident:', { title, description, location })
    res.status(201).json({ message: 'Incident reported successfully' })
})
app.get('/test', (req, res)=>{
    res.json({message: "Hello World!"})
});
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})