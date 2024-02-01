const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _REFRESH_TIME = 3000;

const countConnection = () => {
    const numberConnection = mongoose.connections.length
    console.log(`Number of connections: ${numberConnection}`);
}

const monitorConnection = () => {
    setInterval(() => {
        let pid = process.pid;
        let numConnection =  mongoose.connections.length;
        let numCore = os.cpus().length;
        let cpuUsage= process.cpuUsage().system / 1_000_000 + " seconds";
        let memUsage = process.memoryUsage().rss;

        let dataMonitor = {
            pid: pid,
            numberConnection: numConnection,
            cpuUsage: cpuUsage,
            numberOfCore: numCore,
            memoryUsage: (memUsage / 1024 / 1024).toFixed(2) + " MB",
        }
        process.stdout.write('\u001b[2J\u001b[0;0H') //clear table cũ đi 
        console.table(dataMonitor)
        
    }, _REFRESH_TIME)
}
module.exports = { countConnection, monitorConnection}