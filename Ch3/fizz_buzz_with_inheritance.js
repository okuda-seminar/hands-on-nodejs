const events = require('events')

class FizzBuzzEventEmitter extends events.EventEmitter {
  async start(until) {
    this.emit('start')
    let count = 1 
    while (true) {
      if (count % 15 === 0) { 
        this.emit('FizzBuzz', count)
      } else if (count % 3 === 0) {
        this.emit('Fizz', count)
      } else if (count % 5 === 0) {
        this.emit('Buzz', count)
      }
      count += 1
      if (count >= until) {
        break 
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  this.emit('end') }
}

function startListener() {
  console.log('start') 
}

function fizzListener(count) {
  console.log('Fizz', count)
}

function buzzListener(count) {
  console.log('Buzz', count)
}

function fizzBuzzListener(count) {
  console.log('FizzBuzz', count)
}

function endListener() {
  console.log('end')
  this
    .off('start', startListener)
    .off('Fizz', fizzListener)
    .off('Buzz', buzzListener)
    .off('FizzBuzz', fizzBuzzListener)
    .off('end', endListener)
}

new FizzBuzzEventEmitter()
  .on('start', startListener)
  .on('Fizz', fizzListener)
  .on('Buzz', buzzListener)
  .on('FizzBuzz', fizzBuzzListener)
  .on('end', endListener)
  .start(20)