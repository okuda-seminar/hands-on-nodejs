'use strict';
const fibonacci = require('../fibonacci');
const { workerData: int32Array, parentPort } = require('worker_threads');

parentPort.on('message', n => {
  parentPort.postMessage(fibonacci(n));
  int32Array[0] += 1;
})