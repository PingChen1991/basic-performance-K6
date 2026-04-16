import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

try {
  const result = await lighthouse('https://raider-test-site.onrender.com/', {
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility'],
  });

  const perf = result.lhr.categories.performance;
  console.log('Performance:', Math.round(perf.score * 100));

  if (perf.score < 0.7) {
    throw new Error('Performance below 70!');
  }
} finally {
  await chrome.kill();
}
