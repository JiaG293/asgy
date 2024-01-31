const development = {
    app: {
        port: process.env.DEVELOPMENT_APP_PORT
    },
    db: {
        host: process.env.DEVELOPMENT_DB_HOST,
        port: process.env.DEVELOPMENT_DB_PORT,
        name: process.env.DEVELOPMENT_DB_NAME,
    }
}


const production = {
    app: {
        port: process.env.PRODUCTION_APP_PORT
    },
    db: {
        host: process.env.PRODUCTION_DB_HOST,
        port: process.env.PRODUCTION_DB_PORT,
        name: process.env.PRODUCTION_DB_NAME,
    }
}

const config = { development, production };
const env = process.env.NODE_ENV || 'development';

module.exports = config[env]