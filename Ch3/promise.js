const events = require('events');
const emitter = new events.EventEmitter();
const promise = events.once(emitter, 'event');
console.log(promise);
promise.then(arg => console.log('event happens', arg));
emitter.emit('event', 'Hello World');
emitter.emit('event', 'Hello World again');