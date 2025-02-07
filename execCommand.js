import { exec } from "child_process";

/**
 * Executes a shell command using child_process.exec
 *
 * Use cases:
 * - Running simple shell commands with limited output
 * - Executing command-line tools from Node.js
 * - Handling command execution with built-in promise-like callback
 *
 * Security Note: Avoid using user-provided input directly in commands
 * to prevent command injection vulnerabilities
 */

// Basic execution example
exec("ls -l", (error, stdout, stderr) => {
  // Handle execution errors (e.g., command not found)
  if (error) {
    console.error(`Execution error: ${error.message}`);
    return;
  }

  // Handle command-specific errors (non-zero exit code)
  if (stderr) {
    console.error(`Command error: ${stderr}`);
    return;
  }

  // Process successful output
  console.log(`Command output:\n${stdout}`);
});

// Advanced example with options
const options = {
  timeout: 5000, // Kill process if it runs longer than 5 seconds
  maxBuffer: 1024 * 1024, // 1MB output buffer
  encoding: "utf8",
  cwd: process.cwd(), // Current working directory
};

exec("find . -type f -name '*.js'", options, (error, stdout, stderr) => {
  if (error) {
    if (error.code === "ETIMEDOUT") {
      console.error("Command timed out");
    } else {
      console.error(`Error: ${error.message}`);
    }
    return;
  }

  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }

  const files = stdout.trim().split("\n");
  console.log(`Found ${files.length} JavaScript files`);
});

// Real-world use case example with error handling
const fileName = "example.txt";

// Safe execution with escaped arguments
exec(`ls -l ${escapeShellArg(fileName)}`, (error, stdout) => {
  if (error) {
    console.error(`File not found: ${fileName}`);
    return;
  }
  console.log(`File info:\n${stdout}`);
});

// Helper function to prevent command injection
function escapeShellArg(arg) {
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

// Promisified version for modern async/await usage
function execAsync(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        error.stderr = stderr;
        return reject(error);
      }
      resolve({ stdout, stderr });
    });
  });
}

// Example async/await usage
async function listDirectory() {
  try {
    const { stdout } = await execAsync("ls -l");
    console.log(`Directory contents:\n${stdout}`);
  } catch (error) {
    console.error(`Failed to list directory: ${error.stderr || error.message}`);
  }
}

listDirectory();
