// tools/generateDocs.js
import fs from 'fs';
import path from 'path';
import { parse } from '../parse.js';

export function generateDocs(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = parse(code);
  let output = `# Documentation for ${path.basename(filePath)}\n`;

  ast.body.forEach(node => {
    if (node.type === 'FunctionDeclaration') {
      const name = node.id.name;
      const params = node.params.map(p => p.name).join(', ');
      output += `\n## Function: ${name}\n\n- Parameters: ${params}\n- Description: _[Add description]_\n`;
    }
  });

  return output;
}
