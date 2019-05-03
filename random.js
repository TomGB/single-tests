var esprima = require('esprima');
var escodegen = require('escodegen');

var fs = require('fs');

var contents = fs.readFileSync('tests/something.test.js', 'utf8');

const astOriginal = esprima.parse(contents);
const ast = esprima.parse(contents);

const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const describes = ast.body.filter(item => item.expression.callee.name === 'describe')
const theIts = describes.map(item => ({
    its: item.expression.arguments[1].body.body.filter(bodyItem =>
      bodyItem.type === 'ExpressionStatement' &&
      bodyItem.expression.type === 'CallExpression' &&
      bodyItem.expression.callee.type === 'Identifier' &&
      bodyItem.expression.callee.name === 'it'
    ),
    notIt: item.expression.arguments[1].body.body.filter(bodyItem => !(
      bodyItem.type === 'ExpressionStatement' &&
      bodyItem.expression.type === 'CallExpression' &&
      bodyItem.expression.callee.type === 'Identifier' &&
      bodyItem.expression.callee.name === 'it'
    )),
    original: item
}))

const newBody = theIts.map(({ its, notIt, original }) => {
  const randomIts = shuffle(its)

  original.expression.arguments[1].body.body = [...notIt, ...randomIts]

  return original
})

ast.body = newBody

const output = escodegen.generate(ast)

fs.writeFileSync('random-tests/something.mutate.test.js', output)
