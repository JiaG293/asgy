require('dotenv').config();
const app = require('./src/app')


const {PORT} = process.env;

const server = app.listen( PORT, () => {
    console.log(`server start with port ${PORT}`);
})

process.on('SIGINT', () => {
    server.close( () => console.log(`exit server express`))
})

