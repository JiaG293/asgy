const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { PORT, URL_MOBILE, URL_WEB } = process.env;
const fs = require('fs');
const path = require('path');

//Khoi tao database
require('./dbs/init.mongodb')
// const redisClient = require('./dbs/init.redis')

// global._redisClient = redisClient;

//CORS 
const cors = require("cors");
app.use(cors(/* {
    allowedHeaders: ['x-client-id', 'authorization'],
    origin: [`http://localhost:` + PORT, URL_WEB, URL_MOBILE],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
} */))


//SOCKET.IO
/* const socketService = require('./services/socket.service')
const server = require('http').createServer(app);
socketService.io.attach(server); */

//middleware for client
app.use(helmet()) //che dau cong nghe su dung phia back end x-powered-by



// Neu khong ton tai duong dan se tao ra thu muc 
const logDirectory = path.join(__dirname, '/log');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
const accessLogStream = fs.createWriteStream(
    path.join(logDirectory, 'access.log'),
    { flags: 'a' }
);



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


//config CSP socket io 
/* app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "script-src 'self' https://unpkg.com/socket.io-client@4.7.4/dist/socket.io.min.js 'unsafe-inline'");
    next();
}); */

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google-analytics.com", "https://unpkg.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "'unsafe-inline'", "https://www.google-analytics.com", "https://asgy.s3.ap-southeast-1.amazonaws.com", "https://i.imgur.com"],
            "script-src-attr": ["'unsafe-inline'"],

        },
    })
);
//Testing
app.use('/', express.static('public/css'));
app.use('/', express.static('public/js'));
app.use('/', express.static('public/html'));

//routes
app.use('/', require('./routes/'))


// xu li loi truy cap route invalid
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
