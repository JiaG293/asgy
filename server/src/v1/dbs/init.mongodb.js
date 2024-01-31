const mongoose = require('mongoose')

//strict query
mongoose.set('strictQuery', false)

//connect mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50, //https://www.mongodb.com/docs/drivers/go/v1.7/faq/#:~:text=Connection%20pools%20open%20sockets%20on,option%2C%20which%20defaults%20to%20100%20.
})
    .then(() => console.log('Connected mongoose success!!!'))
    .catch(err => console.error(`Error: connect:::`, err))

// all executed methods log output to console
mongoose.set('debug', true)

// disable colors in debug mode
mongoose.set('debug', { color: false })

// get mongodb-shell friendly output (ISODate)
mongoose.set('debug', { shell: true })


module.exports = mongoose;
