'use strict';
const { fork, setupMaster } = require('cluster');
const port = 3000;

console.log('main process', process.pid);
setupMaster({ exec: `${__dirname}/web_app` });
const cpuCount = require('os').cpus().length;

for (let i = 0; i < cpuCount; i++) {
  const sub = fork();
  console.log('sub process', sub.process.pid); 
  sub.send(port);
  sub.on('message', ({ pid, response }) => {
    console.log(process.pid, `sub process ${pid} returns ${response}`);
  });
};