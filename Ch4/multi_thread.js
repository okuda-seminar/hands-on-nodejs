'use strict';
const { Worker, threadId } = require('worker_threads');
console.log('main thread', threadId);

const cpuCount = require('os').cpus().length;
for (let i = 0; i < cpuCount; i++) {
  const worker = new Worker(`${__dirname}/web_app.js`);
  console.log('sub thread', worker.threadId);
}