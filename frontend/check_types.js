const { exec } = require('child_process');
const fs = require('fs');
exec('npx tsc --noEmit', { cwd: 'c:\\Users\\ck436\\OneDrive\\Desktop\\songs\\frontend' }, (error, stdout, stderr) => {
  fs.writeFileSync('c:\\Users\\ck436\\OneDrive\\Desktop\\songs\\frontend\\tsc_output.txt', stdout || stderr || (error ? error.message : 'success'));
});
