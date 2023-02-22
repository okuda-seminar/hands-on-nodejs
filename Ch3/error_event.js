const events = require('events')

try {
  new events.EventEmitter()
    .on('error', err => console.log('error event'))
    .emit('error', new Error('error'))
} catch(err) {
  console.log('catch')
}