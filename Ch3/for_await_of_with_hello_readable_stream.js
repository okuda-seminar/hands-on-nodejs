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

(async () => {
  const readableStream = new HelloReadableStream({highWaterMark: 0})
    .on('end', () => console.log('End'));
  for await (const data of readableStream) {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('data', data.toString());
  }
})();
