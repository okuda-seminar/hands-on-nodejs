const perf_hooks = require('perf_hooks');
const worker_threads = require('worker_threads');

function useMaybeTransfer(use_transfer) {
  const buffer = new ArrayBuffer(1024 * 1024 * 1024);
  const start = perf_hooks.performance.now();
  new worker_threads.Worker(
    './maybe_transfer.js', {
      workerData: { buffer, use_transfer },
      transferList: use_transfer ? [buffer] : []
    }
  ).on('message', () =>
    console.log(perf_hooks.performance.now() - start)
  );
  console.log(buffer);
}

useMaybeTransfer(true);
useMaybeTransfer(false);