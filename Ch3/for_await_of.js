const events = require('events');
const emitter = new events.EventEmitter();
const iterable = events.on(emitter, 'eventA');
console.log('listeners', emitter.listeners('eventA'));
(async () => {
  for await (const a of iterable) {
    if (a[0] == 'end') {
      break;
    }
    console.log('eventA', a);
  }
})();

emitter.emit('eventA', 'Hello World');
emitter.emit('eventA', 'end');
console.log('listeners', emitter.listeners('eventA'));