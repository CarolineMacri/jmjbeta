function createObject(k, v) {
  let obj = {};

  let putInto = obj;
  let tokens = k.split(".");
  for (let i = 0; i < tokens.length; i++) {
    let name = tokens[i];
    let value = i === tokens.length - 1 ? v : {};
    putInto[name] = putInto[name] || value;
    putInto = putInto[name];
  }

  return obj;
}
var x = createObject("course.big.bang", 4);
console.log(x.course);
