'use strict';
const fibonacci = require('../fibonacci');
const { workerData, parentPort } = require('worker_threads');
parentPort.postMessage(fibonacci(workerData));