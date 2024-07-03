require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 8080;

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(cookieParser())

app.use(express.json())
app.use('/views', express.static(path.join(__dirname, 'public')));

app.use('/views', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/todo', require('./routes/todoRoutes'))
app.get('/', (req, res) => {
    res.redirect('/views');
}); 

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.redirect(`http://localhost:${PORT}/views/404.html`)
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found '})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler) 

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
    console.log(err.stack)
})