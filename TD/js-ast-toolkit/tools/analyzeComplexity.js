// tools/analyzeComplexity.js
import fs from 'fs';
import { parse } from '../parse.js';

export function analyzeComplexity(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = parse(code);
  let complexityReport = `Cyclomatic Complexity Report for ${filePath}\n`;

  ast.body.forEach(node => {
    if (node.type === 'FunctionDeclaration') {
      const name = node.id.name;
      let complexity = 1;

      function countComplexity(body) {
        if (!body) return;
        body.body?.forEach(stmt => {
          if (stmt.type === 'IfStatement' || stmt.type === 'ForStatement' || stmt.type === 'WhileStatement' || stmt.type === 'SwitchStatement') {
            complexity++;
          }
          if (stmt.body) countComplexity(stmt.body);
        });
      }

      countComplexity(node.body);
      complexityReport += `\nFunction ${name}: ${complexity}\n`;
    }
  });

  return complexityReport;
}
