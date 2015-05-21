import { Readable } from 'stream';

class Streamable extends Readable {
  constructor () {
    super();

    this.lines = []

    this.isDone = false;

    // Starting flow mode

    this.buffer = []

    this.on('data', data => this.buffer.push(data));

    // this.on('data', data => console.log('got data', data.toString()))

    this.on('end', () => {});
  }

  addLine (...lines) {
    this.lines.push(...lines)
    console.log('+++', ...lines, this.isDone)
    return this
  }

  then (fulfill, reject) {
    if ( reject ) {
      this.on('error', reject);
    }

    this.on('end', () => fulfill(this.buffer
      .map(line => line.toString())
      .join("\n")));
  }

  done () {
    this.isDone = true;
    this.emit('done');
    console.log('done', this.buffer.map(line => line.toString()))
    while ( this.lines.length ) {
 
        if ( ! this.push( this.lines.shift() ) ) {
 
            break;
 
        }
 
    }
    this.push( null );
    return this;
  }

  _read (sizeIsIgnored) {

    while ( this.lines.length ) {
 
        if ( ! this.push( this.lines.shift() ) ) {
 
            break;
 
        }
 
    }
 
    if ( ! this.lines.length ) {


    }
  }
}

export default Streamable;
