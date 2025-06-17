// js-ast-toolkit/parse-folder.js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const targetDir = './src';
const report = [];

if (!fs.existsSync(targetDir)) {
  console.error(`Directory not found: ${targetDir}`);
  process.exit(1);
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (fullPath.endsWith('.js')) {
      callback(fullPath);
    }
  });
}

walkDir(targetDir, filePath => {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
      locations: true
    });
  } catch (err) {
    console.error(`Failed to parse ${filePath}:`, err.message);
    return;
  }

  traverse(ast, {
    ArrowFunctionExpression(path) {
      if (t.isVariableDeclarator(path.parent)) {
        const funcName = path.parent.id.name;
        report.push({
          type: 'arrow',
          name: funcName,
          file: filePath,
          line: path.node.loc.start.line
        });
      }

      // Replace with function expression
      const func = t.functionExpression(
        null,
        path.node.params,
        t.isBlockStatement(path.node.body)
          ? path.node.body
          : t.blockStatement([t.returnStatement(path.node.body)]),
        false,
        false
      );
      path.replaceWith(func);
    },

    FunctionDeclaration(path) {
      const name = path.node.id.name;
      report.push({
        type: 'function',
        name,
        file: filePath,
        line: path.node.loc.start.line
      });

      // Inject logging
      const log = t.expressionStatement(
        t.callExpression(t.identifier('console.log'), [
          t.stringLiteral(`Entered function: ${name}`)
        ])
      );
      path.node.body.body.unshift(log);
    },

    ImportDeclaration(path) {
      report.push({
        type: 'import',
        source: path.node.source.value,
        file: filePath
      });
    },

    ExportNamedDeclaration(path) {
      const declaration = path.node.declaration;
      report.push({
        type: 'export',
        name: declaration?.id?.name || '[anonymous]',
        file: filePath
      });
    }
  });

  const { code: newCode } = generate(ast, {}, code);
  fs.writeFileSync(filePath, newCode, 'utf8');
});

fs.writeFileSync('./report.json', JSON.stringify(report, null, 2));
console.log('AST parsing complete. Report written to report.json');
