const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const code = `
  const square = (n) => n * n;
`;

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx']
});

// Traverse
traverse(ast, {
  ArrowFunctionExpression(path) {
    console.log('Found an arrow function!');
  }
});

// Generate code back from AST
const output = generate(ast, {}, code);
console.log('Regenerated code:\n', output.code);
