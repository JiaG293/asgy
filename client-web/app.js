const express = require('express')
const path = require('path')
const routerHTML = require('./routes/redirect')
const cors = require('cors')


//setup
const PORT = 8085;
const app = express();
app.use(cors())


app.use('/', routerHTML); 

//listen port
app.listen(PORT, ()=> console.log(`Running on port: http://localhost:${PORT}` ))