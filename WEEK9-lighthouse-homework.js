import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

const THRESHOLDS = {
  performance: 0.7,
  accessibility: 0.9,
};

const URLS = [
  'https://raider-test-site.onrender.com/',
  'https://raider-test-site.onrender.com/?category=Apparel',
];

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless'],
});

let hasError = false;
const report = [];

console.log('=== Lighthouse Report ===\n');

for (const url of URLS) {
  const result = await lighthouse(url, {
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility'],
  });

  const perf = result.lhr.categories.performance.score;
  const a11y = result.lhr.categories.accessibility.score;

  const data = {
    url,
    performance: Math.round(perf * 100),
    accessibility: Math.round(a11y * 100),
    performancePass: perf >= THRESHOLDS.performance,
    accessibilityPass: a11y >= THRESHOLDS.accessibility,
  };

  report.push(data);

  console.log(`URL: ${url}`);
  console.log(`  Performance: ${data.performance}`);
  console.log(`  Accessibility: ${data.accessibility}`);

  if (!data.performancePass) {
    console.log(`  ❌ Performance below threshold`);
    hasError = true;
  } else {
    console.log(`  ✅ Performance PASS`);
  }

  if (!data.accessibilityPass) {
    console.log(`  ❌ Accessibility below threshold`);
    hasError = true;
  } else {
    console.log(`  ✅ Accessibility PASS`);
  }

  console.log('-----------------------------------\n');
}

// save report
fs.writeFileSync('lighthouse-report.json', JSON.stringify(report, null, 2));

await chrome.kill();
