const stream = require('stream');

class LineTransformStream extends stream.Transform {
  remaining = '';
  
  constructor(options) {
    super({readableObjectMode: true, ...options});
  }

  _transform(chunk, encoding, callback) {
    console.log('_transform()');
    const lines = (chunk + this.remaining).split(/\n/);
    this.remaining = lines.pop();
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

const transformStream = new LineTransformStream();
transformStream.on('readable', () => {
  let chunk;
  while((chunk = transformStream.read()) !== null) {
    console.log(chunk);
  }
});
console.log('write');
transformStream.write('foo\nbar');
console.log('write');
transformStream.write('baz');
console.log('end');
transformStream.end();