const stream = require('stream');

class DelayLogStream extends stream.Writable {
  constructor(options) {
    super({objectMode: true, ...options});
  }

  _write(chunk, encoding, callback) {
    console.log('_write()');
    const {message, delay} = chunk;
    setTimeout(() => {
      console.log(message);
      callback();
    }, delay);
  }
}

const logStream = new DelayLogStream();
logStream.write({message: 'Hi', delay: 0});
logStream.write({message: 'Bi', delay: 1000});