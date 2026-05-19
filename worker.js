/* ──────────────────────────────────────────────────────────────
   worker.js — File I/O helper (background thread)
   
   Handles reading large files into ArrayBuffer off the main thread
   so the UI doesn't freeze during the read phase.
   FFmpeg itself runs on the main thread (it spawns its own internal
   web worker — nesting a worker-in-a-worker causes silent failures).
   ────────────────────────────────────────────────────────────── */

self.onmessage = async (e) => {
  const { type, file } = e.data;

  if (type === 'READ_FILE') {
    try {
      const buffer = await file.arrayBuffer();
      self.postMessage(
        { type: 'FILE_READ', buffer },
        [buffer]                             // transfer, not copy
      );
    } catch (err) {
      self.postMessage({ type: 'ERROR', message: err.message });
    }
  }
};