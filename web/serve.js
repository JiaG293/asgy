const { exec } = require('child_process');
const path = require('path');

// Đường dẫn tới thư mục build của ứng dụng React
const root = path.join(__dirname, 'build');

// Chạy serve và cấu hình chuyển hướng
const serveCommand = `pm2 serve ${root} 80 --name web --spa`;
exec(serveCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error running serve: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
