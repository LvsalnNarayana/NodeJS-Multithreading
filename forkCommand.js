/**
 * Example: Using `fork` in Node.js to create a child process.
 *
 * This example forks a new Node.js process to execute `child-script.js`.
 * The parent and child process communicate via IPC (Inter-Process Communication).
 */

import { fork } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

// Resolve the directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the path to the child script (must be a Node.js script)
const childScriptPath = path.resolve(__dirname, "scripts", "child-script.js");

// Fork a new Node.js process and run the child script
// const child = fork(childScriptPath);
const child =fork("invalid-script.js", { silent: true });

console.log(`Forked process running: ${childScriptPath}`);

// Listen for messages from the child process
child.on("message", (msg) => {
  console.log("Parent received message from child:");
  console.table(msg)
  process.exit(0);
});

// Handle errors in the child process
child.on("error", (err) => {
  console.error("Child process error:", err);
  process.exit(1);
});

// Handle child process exit event
child.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Child process exited with code ${code}`);
  } else {
    console.log("Child process exited successfully.");
  }
});

// Send a message to the child process
child.send({ size: 100 });
