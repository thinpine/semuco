# semuco

**Se(rverless)Mu(ltimedia)Co(mpression)**: A simple frontend to compress media files with FFmpeg. It doesn't use any backend server, handling everything locally in your browser via WebAssembly.

## Architecture & Design
semuco is a zero-build-step, vanilla HTML/JS application. It loads local files into an isolated sandbox using a background Web Worker (`worker.js`) to prevent UI freezing. The core processing is driven by the FFmpeg WebAssembly port (`@ffmpeg/ffmpeg`). To enable multi-threading on static hosts like GitHub Pages, the app utilizes `coi-serviceworker.js` to automatically inject `COOP` and `COEP` security headers, satisfying browser `SharedArrayBuffer` requirements without server-side configuration.

## Limitations
* **Performance:** Browser WebAssembly is strictly CPU-bound and lacks dedicated hardware encoding (like NVENC or VideoToolbox). Processing will be significantly slower than a native desktop FFmpeg installation. This is mainly a very basic web application to quickly compress already small media files and perform basic trimming/cropping on them. For a more efficient and configurable compression experience, I advise you to use FFmpeg directly on your local: https://ffmpeg.org/
* **Decoding Overhead:** Highly compressed or massive source formats (such as 4K HEVC/H.265, or even basic screen recordings on devices with high resolution screens) will take considerable time simply to decode before the actual compression phase begins.
* **Memory Limits:** The application loads files into the browser's virtual memory (MEMFS) for processing. Therefore, extremely large files (e.g., >2GB) may crash the tab or hit memory allocation limits depending on your device's available RAM.