const { exec } = require('child_process');

const copyToClipboard = (data) => {
    const cleanedData = data.replace(/\s+/g, '')
    exec(`echo|set/p="${cleanedData}"|clip`, (err, stdout, stderr) => {
        if (err) {
            console.error('Data save failed clipboard:', err);
            return;
        }
        console.log('Data saved clipboard:', data);
    });
}

module.exports = {
    copyToClipboard
}