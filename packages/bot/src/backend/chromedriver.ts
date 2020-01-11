const chromedriver = require('chromedriver');
const retry = require('p-retry');
const http = require('axios');

/**
 * Start chromedriver and waits for it to become available before the tests start.
 * Call this on wdio.confg `onPrepare`, passing `this` (the wdio config)
 */
export function start(config: { host?: string, port?: number, path?: string} = {}) {
  const pollUrl = `https://${config.host || 'localhost'}:${config.port || 4444}${config.path || '/wd/hub'}/status`;
  console.log('chromedriver starting on:', pollUrl);

  const proc = chromedriver.start([`--url-base=${config.path ||'/wd/hub'}`, `--port=${config.port||4444}`]);
  process.on('exit', () => proc.kill()); // attempt to cleanup this subprocess

  return retry((() => http.get(pollUrl)), {retries:5, minDelay: 200});
}

/**
 * Call this on wdio.config `after` hook.  May not strictly be necessary
 * because the child process should be killed when this test exits.
 */
export function stop() {
  chromedriver.stop();
}