importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

async function initPyodide() {
    self.pyodide = await loadPyodide();
    // Redirect sys.stdout to a buffer we can read
    await self.pyodide.runPythonAsync(`
        import sys
        import io
        sys.stdout = io.StringIO()
        sys.stderr = io.StringIO()
    `);
}

let pyodideReadyPromise = initPyodide();

self.onmessage = async (event) => {
    const { id, code } = event.data;
    
    try {
        await pyodideReadyPromise;
        
        // Reset buffers
        await self.pyodide.runPythonAsync(`
            sys.stdout.truncate(0)
            sys.stdout.seek(0)
            sys.stderr.truncate(0)
            sys.stderr.seek(0)
        `);

        // Run user code
        await self.pyodide.runPythonAsync(code);

        // Get output
        const stdout = await self.pyodide.runPythonAsync(`sys.stdout.getvalue()`);
        const stderr = await self.pyodide.runPythonAsync(`sys.stderr.getvalue()`);

        self.postMessage({ id, success: true, output: stdout || stderr });
    } catch (error) {
        self.postMessage({ id, success: false, output: error.message });
    }
};
