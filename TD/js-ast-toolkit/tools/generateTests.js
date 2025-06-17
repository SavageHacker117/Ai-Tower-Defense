// tools/generateTests.js
import fs from 'fs';
import { parse } from '../parse.js';

export function generateTests(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = parse(code);
  let tests = '';

  ast.body.forEach(node => {
    if (node.type === 'FunctionDeclaration') {
      const fnName = node.id.name;
      tests += `\ntest('${fnName} should work correctly', () => {\n  // Arrange\n  const result = ${fnName}();\n  // Assert\n  expect(result).toBeDefined();\n});\n`;
    }
  });

  return tests;
}
