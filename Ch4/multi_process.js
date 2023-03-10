'use strict';

const { fork, setupMaster } = require('cluster');

console.log('main process', process.pid);
setupMaster({ exec: `${__dirname}/web_app` });
const cpuCount = require('os').cpus().length;
for (let i = 0; i < cpuCount; i++) {
  const sub = fork();
  console.log('sub process', sub.process.pid);
}