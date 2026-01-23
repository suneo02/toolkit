const path = require('path');
const { formatNameStatus } = require('../generate-diff-report.js');

function testFormatNameStatus() {
  const input = [
    'A\tsrc/new.js',
    'M\tlib/util.js',
    'D\tdocs/old.md',
    'R100\told/name.js\tnew/name.js',
    'C85\tsrc/a.js\tsrc/b.js',
  ].join('\n');
  const res = formatNameStatus(input);
  const byPath = Object.fromEntries(res.map((r) => [r.filePath, r]));

  // Added
  if (!byPath['src/new.js'] || byPath['src/new.js'].status !== 'A') {
    throw new Error('Added file parse failed');
  }
  // Modified
  if (!byPath['lib/util.js'] || byPath['lib/util.js'].status !== 'M') {
    throw new Error('Modified file parse failed');
  }
  // Deleted (still present in name-status list)
  if (!res.find((r) => r.status.startsWith('D'))) {
    throw new Error('Deleted status not present');
  }
  // Rename
  const rn = byPath['new/name.js'];
  if (!rn || rn.status !== 'R100' || rn.oldPath !== 'old/name.js') {
    throw new Error('Rename parse failed');
  }
  if (rn.similarity !== 100) {
    throw new Error('Rename similarity parse failed');
  }
  // Copy
  const cp = byPath['src/b.js'];
  if (!cp || cp.status !== 'C85' || cp.oldPath !== 'src/a.js') {
    throw new Error('Copy parse failed');
  }
  if (cp.similarity !== 85) {
    throw new Error('Copy similarity parse failed');
  }
}

function run() {
  testFormatNameStatus();
  process.stdout.write('All tests passed\\n');
}

if (require.main === module) {
  run();
}
