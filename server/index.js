const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('config')
const cookies = require ('cookie-parser')

const app = express()

app.use(express.json({ extend: true }))
app.use(cookies())
app.use(cors())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api/subscribe', require('./routes/subscribe'))

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`App has ben started on port ${PORT}`))
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()


