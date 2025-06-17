#!/usr/bin/env node
// Extended CLI with viz, annotate, snapshot, and CI reporting
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk').default;
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .command('complexity', 'Analyze function complexity')
  .command('snapshot', 'Save complexity report to snapshots dir')
  .command('viz', 'Generate complexity chart HTML')
  .command('annotate', 'Insert TODO comments for flagged functions')
  .command('ci-check', 'CI mode: fail + GitHub style output')
  .option('max-lines', { type: 'number', default: 60 })
  .option('max-cyclomatic', { type: 'number', default: 10 })
  .option('max-nesting', { type: 'number', default: 3 })
  .option('fail-on-high', { type: 'boolean' })
  .option('md', { type: 'boolean' })
  .argv;

const command = argv._[0];
const targetPath = argv._[1] || 'src';
const report = [];

function walkFiles(dir, extFilter, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) walkFiles(fullPath, extFilter, callback);
    else if (!extFilter || fullPath.endsWith(extFilter)) callback(fullPath);
  });
}

function computeComplexity(funcNode) {
  let nesting = 0;
  let maxNesting = 0;
  let branches = 0;
  const safeBody = funcNode.body?.body || [];
  traverse({ type: 'File', program: { type: 'Program', body: safeBody, sourceType: 'module' } }, {
    enter(path) {
      if (path.isIfStatement() || path.isForStatement() || path.isWhileStatement() || path.isSwitchStatement() || path.isConditionalExpression()) {
        branches++; nesting++;
        if (nesting > maxNesting) maxNesting = nesting;
      }
    },
    exit(path) {
      if (path.isIfStatement() || path.isForStatement() || path.isWhileStatement() || path.isSwitchStatement() || path.isConditionalExpression()) nesting--;
    }
  });
  return { nesting: maxNesting, cyclomatic: branches + 1 };
}

function analyzeFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'classProperties'] });
  traverse(ast, {
    FunctionDeclaration(path) {
      const name = path.node.id.name;
      const loc = path.node.loc;
      const params = path.node.params.length;
      const lines = loc.end.line - loc.start.line + 1;
      const { nesting, cyclomatic } = computeComplexity(path.node);
      report.push({ file, name, lines, nesting, params, cyclomatic });
    },
    ClassMethod(path) {
      const name = path.node.key.name;
      const loc = path.node.loc;
      const params = path.node.params.length;
      const lines = loc.end.line - loc.start.line + 1;
      const { nesting, cyclomatic } = computeComplexity(path.node);
      report.push({ file, name, lines, nesting, params, cyclomatic });
    }
  });
}

if (fs.statSync(targetPath).isDirectory()) walkFiles(targetPath, '.js', analyzeFile);
else analyzeFile(targetPath);

const maxLines = argv['max-lines'];
const maxCyclo = argv['max-cyclomatic'];
const maxNesting = argv['max-nesting'];
const failOnHigh = argv['fail-on-high'] || false;

let flagged = 0;
const lines = [];
lines.push(`| File | Function | Lines | Nesting | Params | Cyclomatic | Refactor Suggestion |`);
lines.push(`|------|----------|-------|---------|--------|------------|----------------------|`);

report.forEach(r => {
  const lineWarn = r.lines > maxLines;
  const cycloWarn = r.cyclomatic > maxCyclo;
  const nestingWarn = r.nesting > maxNesting;
  const style = lineWarn || cycloWarn || nestingWarn ? chalk.red : chalk.gray;
  let suggestions = [];
  if (lineWarn) suggestions.push('✂️ Decompose');
  if (nestingWarn) suggestions.push('🚧 Guard Clauses', '🔁 Early Return');
  if (cycloWarn) suggestions.push('🧮 Simplify Logic');
  const suggestionStr = suggestions.join(', ');
  lines.push(`| ${path.basename(r.file)} | ${r.name} | ${style(r.lines)} | ${style(r.nesting)} | ${style(r.params)} | ${style(r.cyclomatic)} | ${suggestionStr} |`);
  if (suggestions.length) flagged++;
});

const markdownContent = lines.join('\n');
const snapshotFile = `reports/complexity-${new Date().toISOString().slice(0, 10)}.md`;

switch (command) {
  case 'complexity':
    if (argv.md) {
      fs.writeFileSync('COMPLEXITY.md', markdownContent);
      console.log(chalk.green('📄 COMPLEXITY.md report generated.'));
    } else {
      fs.writeFileSync('complexity.report.json', JSON.stringify(report, null, 2));
      console.log(chalk.green('📊 complexity.report.json saved.'));
    }
    break;

  case 'snapshot':
    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync(snapshotFile, markdownContent);
    console.log(chalk.green(`📁 Snapshot saved: ${snapshotFile}`));
    break;

  case 'viz':
    const html = `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Complexity Chart</title>
    <script src='https://cdn.jsdelivr.net/npm/chart.js'></script></head><body>
    <canvas id='chart' width='900' height='600'></canvas>
    <script>
    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar', data: {
        labels: ${JSON.stringify(report.map(r => r.name))},
        datasets: [
          { label: 'Lines', data: ${JSON.stringify(report.map(r => r.lines))}, backgroundColor: '#888' },
          { label: 'Cyclomatic', data: ${JSON.stringify(report.map(r => r.cyclomatic))}, backgroundColor: '#f66' },
          { label: 'Nesting', data: ${JSON.stringify(report.map(r => r.nesting))}, backgroundColor: '#6f6' }
        ]}, options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
    </script></body></html>`;
    fs.writeFileSync('complexity-chart.html', html);
    console.log(chalk.green('📊 complexity-chart.html generated.'));
    break;

  case 'annotate':
    report.forEach(r => {
      const lineWarn = r.lines > maxLines;
      const cycloWarn = r.cyclomatic > maxCyclo;
      const nestingWarn = r.nesting > maxNesting;
      if (lineWarn || cycloWarn || nestingWarn) {
        const comment = `// TODO: ${r.name} exceeds limits: ` + [
          lineWarn ? `lines=${r.lines}` : '',
          nestingWarn ? `nesting=${r.nesting}` : '',
          cycloWarn ? `cyclomatic=${r.cyclomatic}` : ''
        ].filter(Boolean).join(', ') + '\n';
        const orig = fs.readFileSync(r.file, 'utf8');
        if (!orig.includes(comment)) {
          fs.writeFileSync(r.file, comment + orig, 'utf8');
        }
      }
    });
    console.log(chalk.green('📝 Annotations inserted.')); break;

  case 'ci-check':
    report.forEach(r => {
      if (r.lines > maxLines || r.cyclomatic > maxCyclo || r.nesting > maxNesting) {
        process.stdout.write(`::error file=${r.file},title=${r.name}::Function too complex (lines=${r.lines}, nesting=${r.nesting}, cyclomatic=${r.cyclomatic})\n`);
      }
    });
    if (failOnHigh && flagged > 0) process.exit(1);
    break;

  default:
    console.log(chalk.yellow('⚠️ No command matched. Try --help'));
    break;
}

if (failOnHigh && flagged > 0 && command === 'complexity') {
  console.error(chalk.red(`❌ ${flagged} functions exceeded thresholds.`));
  process.exit(1);
} else if (flagged > 0 && command === 'complexity') {
  console.log(chalk.yellow(`⚠️  ${flagged} functions exceeded thresholds.`));
} else if (command === 'complexity') {
  console.log(chalk.green('✅ All functions within safe thresholds.'));
}
