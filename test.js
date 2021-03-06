
var assert = require('assert');
var equal = assert.deepEqual;
var extract = require('./');

describe('extract(buf, key)', function(){
  it('should extract a value', function(){
    var buf = toBuf({ foo: 'bar' });
    equal(extract(buf, 'foo'), 'bar');
  })
  it('should end on ,', function(){
    var buf = toBuf({ foo: 'bar', bar: 'baz' });
    equal(extract(buf, 'foo'), 'bar');
  })
  it('should ignore values when looking for keys', function(){
    var buf = toBuf({ foo: 'bar', bar: 'baz' });
    equal(extract(buf, 'bar'), 'baz');
  })
  it('should ignore too deeply nested values', function(){
    var buf = toBuf({ foo: { beep: 'boop', bar: 'oops' }, bar: 'baz' });
    equal(extract(buf, 'bar'), 'baz');
    buf = toBuf({ foo: [{ bar: 'oops' }], bar: 'baz' });
    equal(extract(buf, 'bar'), 'baz');
  })
  it('should ignore strings with special chars', function(){
    var buf = toBuf({ foo: ',bar', bar: 'baz' });
    equal(extract(buf, 'bar'), 'baz');
  })
  it('should extract objects', function(){
    var buf = toBuf({ foo: { bar: 'baz' }});
    equal(extract(buf, 'foo'), { bar: 'baz' });
  })
  it('should extract arrays', function(){
    var buf = toBuf({ foo: ['bar', 'baz']});
    equal(extract(buf, 'foo'), ['bar', 'baz']);
  })
  it('should escape with backslash', function(){
    var buf = toBuf({ beep: '\"', foo: 'bar' });
    equal(extract(buf, 'foo'), 'bar');
    var buf = toBuf({ foo: 'bar\"baz' });
    equal(extract(buf, 'foo'), 'bar\"baz');
  });
})

function toBuf(obj){
  return new Buffer(JSON.stringify(obj));
}
