/**
 * Child Process Manager
 *
 * Executes Python or Node.js child processes with parameter validation,
 * error handling, and result processing.
 *
 * Use Cases:
 * - Execute CPU-intensive tasks in separate processes
 * - Run different language scripts from a Node.js parent process
 * - Handle long-running operations with proper cleanup
 * - Process isolation for security/stability
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Constants and Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = path.resolve(__dirname, "scripts");
const EXECUTORS = {
  python: {
    command: "python3",
    script: path.resolve(SCRIPTS_DIR, "child-script.py"),
  },
  js: {
    command: "node",
    script: path.resolve(SCRIPTS_DIR, "child-script.js"),
  },
};

// Unified Child Process Handler
async function executeChildProcess(type, parameter) {
  validateInput(type, parameter);

  const { command, script } = EXECUTORS[type];
  const child = spawn(command, [script, parameter.toString()]);

  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    let errorLogged = false;

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
      if (!errorLogged) {
        errorLogged = true;
        reject(formatError(`Process Error: ${stderr.trim()}`, type, parameter));
      }
    });

    child.on("error", (error) => {
      reject(formatError(`Spawn Error: ${error.message}`, type, parameter));
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(formatError(`Exit Code ${code}`, type, parameter));
      } else {
        resolve({
          type,
          parameter,
          result: stdout.trim(),
          duration: Date.now() - startTime,
        });
      }
    });

    const startTime = Date.now();
  });
}

// Validation and Utilities
function validateInput(type, parameter) {
  if (!EXECUTORS[type]) {
    throw new Error(
      `Invalid script type: ${type}. Supported types: ${Object.keys(
        EXECUTORS
      ).join(", ")}`
    );
  }

  if (typeof parameter !== "number" || parameter <= 0) {
    throw new Error(`Invalid parameter: ${parameter}. Must be positive number`);
  }
}

function formatError(message, type, parameter) {
  return new Error(
    `[${type.toUpperCase()} Process] ${message} | Input: ${parameter}`
  );
}

// CLI Interface
async function main() {
  try {
    const args = parseCliArguments(process.argv.slice(2));

    if (!args.type || !args.value) {
      throw new Error(
        "Missing required arguments. Usage: --type=<type> --value=<number>"
      );
    }

    const result = await executeChildProcess(
      args.type.toLowerCase(),
      Number(args.value)
    );

    console.log("Execution Result:");
    console.table([result]);
  } catch (error) {
    console.error("❌ Execution Failed:");
    console.error(error.message);
    process.exit(1);
  }
}

function parseCliArguments(args) {
  return args.reduce((acc, arg) => {
    const [key, value] = arg.split("=");
    acc[key.replace("--", "")] = value;
    return acc;
  }, {});
}

// Start application
main();
