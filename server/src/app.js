const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { PORT } = process.env;
const fs = require('fs');
const path = require('path');

//Khoi tao database
require('./v1/dbs/init.mongodb')
// require('./v1/dbs/init.redis')



//CORS 
const cors = require("cors");
app.use(cors({
    origin: [`http://localhost:` + PORT],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}))



//middleware for client
app.use(helmet()) //che dau cong nghe su dung phia back end x-powered-by

const accessLogStream = fs.createWriteStream(
    path.join(
        __dirname,
        'v1/log/access.log'
    ),
    { flags: 'a' }
)


app.use(morgan(
    'common',
    { stream: accessLogStream }
)
) //ghi lai thong tin client truy cap 

app.use(compression()) //toi uu response cho client



// them cookie parser
app.use(cookieParser());

// body parser
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// app.use('/public', express.static('public'));

//router
app.use('/', require('./v1/routes'))

// xu li loi 
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

module.exports = app;
