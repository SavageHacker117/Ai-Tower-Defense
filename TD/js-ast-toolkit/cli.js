#!/usr/bin/env node
// Dev Assistant CLI: complexity audit, visualization, test scaffolding, CI-friendly

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk').default;
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .scriptName("devtool")
  .usage('$0 <command> [options]')
  .command('complexity', 'Analyze JS complexity (nesting, cyclomatic, lines)')
  .command('snapshot', 'Save Markdown snapshot in /reports')
  .command('viz', 'Generate chart HTML to visualize function complexity')
  .command('annotate', 'Insert TODOs in source code for flagged functions')
  .command('ci-check', 'CI-mode: log GitHub warnings & optionally fail')
  .command('test-stubs', 'Generate Jest test stubs for each function')
  .option('max-lines', { type: 'number', default: 60, describe: 'Max allowed lines per function' })
  .option('max-cyclomatic', { type: 'number', default: 10, describe: 'Max cyclomatic complexity' })
  .option('max-nesting', { type: 'number', default: 3, describe: 'Max nesting depth' })
  .option('fail-on-high', { type: 'boolean', describe: 'Exit non-zero if any function exceeds limits' })
  .option('md', { type: 'boolean', describe: 'Emit markdown report instead of JSON' })
  .help()
  .argv;

const command = argv._[0];
const targetPath = argv._[1] || 'src';
const report = [];

function walkFiles(dir, ext, cb) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkFiles(full, ext, cb);
    else if (!ext || full.endsWith(ext)) cb(full);
  });
}

function computeComplexity(node) {
  let nesting = 0, maxNesting = 0, branches = 0;
  traverse({ type: 'File', program: { body: node.body.body || [], sourceType: 'module' } }, {
    enter(p) {
      if (p.isIfStatement() || p.isLoop() || p.isSwitchStatement() || p.isConditionalExpression()) {
        branches++; nesting++;
        maxNesting = Math.max(maxNesting, nesting);
      }
    },
    exit(p) {
      if (p.isIfStatement() || p.isLoop() || p.isSwitchStatement() || p.isConditionalExpression()) nesting--;
    }
  });
  return { nesting: maxNesting, cyclomatic: branches + 1 };
}

function analyzeFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'classProperties'] });
  traverse(ast, {
    FunctionDeclaration(path) {
      reportFunction(file, path.node);
    },
    ClassMethod(path) {
      reportFunction(file, path.node);
    }
  });
}

function reportFunction(file, node) {
  const { name } = node.id || node.key;
  const loc = node.loc;
  const lines = loc.end.line - loc.start.line + 1;
  const params = node.params.length;
  const { nesting, cyclomatic } = computeComplexity(node);
  report.push({ file, name, lines, nesting, params, cyclomatic });
}

if (fs.statSync(targetPath).isDirectory()) walkFiles(targetPath, '.js', analyzeFile);
else analyzeFile(targetPath);

const maxLines = argv['max-lines'];
const maxCyclo = argv['max-cyclomatic'];
const maxNesting = argv['max-nesting'];
const failOnHigh = argv['fail-on-high'] || false;
const flagged = report.filter(r => r.lines > maxLines || r.nesting > maxNesting || r.cyclomatic > maxCyclo);

const markdown = [
  `| File | Function | Lines | Nesting | Params | Cyclomatic | Suggestions |`,
  `|------|----------|-------|---------|--------|------------|-------------|`
];

for (const r of report) {
  const warn = r.lines > maxLines || r.cyclomatic > maxCyclo || r.nesting > maxNesting;
  let tips = [];
  if (r.lines > maxLines) tips.push('✂️ Decompose');
  if (r.nesting > maxNesting) tips.push('🚧 Guard Clauses');
  if (r.cyclomatic > maxCyclo) tips.push('🧮 Simplify Logic');

  markdown.push(`| ${path.basename(r.file)} | ${r.name} | ${r.lines} | ${r.nesting} | ${r.params} | ${r.cyclomatic} | ${tips.join(', ')} |`);
}

function writeSnapshot() {
  const fname = `reports/complexity-${new Date().toISOString().slice(0, 10)}.md`;
  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync(fname, markdown.join('\n'));
  console.log(chalk.green(`📸 Saved snapshot to ${fname}`));
}

function writeChart() {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Complexity Chart</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script></head><body>
  <canvas id="chart" width="960" height="480"></canvas>
  <script>
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar', data: {
      labels: ${JSON.stringify(report.map(r => r.name))},
      datasets: [
        { label: 'Lines', data: ${JSON.stringify(report.map(r => r.lines))}, backgroundColor: '#999' },
        { label: 'Cyclomatic', data: ${JSON.stringify(report.map(r => r.cyclomatic))}, backgroundColor: '#e44' },
        { label: 'Nesting', data: ${JSON.stringify(report.map(r => r.nesting))}, backgroundColor: '#4c4' }
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
  </script></body></html>`;
  fs.writeFileSync('complexity-chart.html', html);
  console.log(chalk.green('📊 Generated complexity-chart.html'));
}

function annotateFiles() {
  for (const r of flagged) {
    const todo = `// TODO: ${r.name} too complex (lines=${r.lines}, nesting=${r.nesting}, cyclomatic=${r.cyclomatic})\n`;
    const code = fs.readFileSync(r.file, 'utf8');
    if (!code.includes(todo)) {
      fs.writeFileSync(r.file, todo + code);
    }
  }
  console.log(chalk.green('📝 Annotations inserted.'));
}

function generateTestStubs() {
  const testsDir = 'tests';
  fs.mkdirSync(testsDir, { recursive: true });
  for (const r of report) {
    const testFile = path.join(testsDir, `${path.basename(r.file, '.js')}.test.js`);
    const stub = `describe('${r.name}', () => {
  it('should behave correctly', () => {
    // TODO: implement test for ${r.name}
  });
});\n`;
    fs.appendFileSync(testFile, stub);
  }
  console.log(chalk.green('🧪 Test stubs generated in /tests'));
}

switch (command) {
  case 'complexity':
    if (argv.md) fs.writeFileSync('COMPLEXITY.md', markdown.join('\n'));
    else fs.writeFileSync('complexity.report.json', JSON.stringify(report, null, 2));
    console.log(chalk.green('✅ Complexity analysis done.'));
    break;

  case 'snapshot': writeSnapshot(); break;
  case 'viz': writeChart(); break;
  case 'annotate': annotateFiles(); break;
  case 'test-stubs': generateTestStubs(); break;

  case 'ci-check':
    for (const r of flagged) {
      process.stdout.write(`::error file=${r.file},title=${r.name}::Too complex (lines=${r.lines}, nesting=${r.nesting}, cyclomatic=${r.cyclomatic})\n`);
    }
    if (failOnHigh && flagged.length) process.exit(1);
    break;

  default:
    console.log(chalk.yellow('⚠️  Unknown command. Try `--help`'));
}

if (failOnHigh && flagged.length && command === 'complexity') {
  console.error(chalk.red(`❌ ${flagged.length} function(s) exceeded thresholds.`));
  process.exit(1);
} else if (flagged.length && command === 'complexity') {
  console.warn(chalk.yellow(`⚠️  ${flagged.length} function(s) need refactoring.`));
} else if (command === 'complexity') {
  console.log(chalk.green('🎉 All functions within safe complexity thresholds.'));
}
