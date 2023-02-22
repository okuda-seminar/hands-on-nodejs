const stream = require('stream');

class HelloReadableStream extends stream.Readable {
  constructor(options) {
    super(options)
    this.languages = ['JavaScript', 'Python', 'Java', 'C#'];
  }

  _read(size) {
    console.log('_read()');
    let language;
    while ((language = this.languages.shift())) {
      if(!this.push(`Hello, ${language}\n`)) {
        console.log('Stop reading');
        return;
      }
    }
    console.log('Finish reading');
    this.push(null);
  }
}

class LineTransformStream extends stream.Transform {
  remaining = '';
  
  constructor(options) {
    super({readableObjectMode: true, ...options});
  }

  _transform(chunk, encoding, callback) {
    console.log('_transform()');
    const lines = (chunk + this.remaining).split(/\n/);
    this.remaining = lines.pop();
    console.log('lines', lines);
    for (const line of lines) {
      this.push({message: line, delay: line.length * 100})
    }
    callback()
  }

  _flush(callback) {
    console.log('_flush()');
    this.push({message: this.remaining, delay: this.remaining.length * 100});
    callback();
  }
}

class DelayLogStream extends stream.Writable {
  constructor(options) {
    super({objectMode: true, ...options});
  }

  _write(chunk, encoding, callback) {
    console.log('_write()');
    console.log('chunk', chunk);
    const {message, delay} = chunk;
    setTimeout(() => {
      console.log(message);
      callback();
    }, delay);
  }
}

new HelloReadableStream()
  .pipe(new LineTransformStream())
  .pipe(new DelayLogStream())
  .on('finish', () => console.log('Finish'));