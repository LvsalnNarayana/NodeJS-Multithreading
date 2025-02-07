# Node.js Multithreading & Process Management

This repository explores various ways to manage child processes in Node.js. It covers different execution strategies like spawning, forking, and executing system commands. The purpose is to demonstrate how to handle CPU-intensive tasks, run external scripts, and communicate between parent and child processes effectively.

## Features
- **Multithreading in Node.js** using `child_process`
- **Inter-Process Communication (IPC)** with `fork()`
- **Running external scripts** (Python & Node.js)
- **Executing shell commands** securely
- **Process isolation & resource management**
- **Error handling & performance measurement**

## Concepts Explained

### 1. **Spawning Child Processes (`spawn`)**
The `spawn` function is used to create child processes while maintaining streams for real-time communication.
- **Use case**: Running long-lived processes, interacting with input/output streams.
- **Example**: Running Python and Node.js scripts as separate processes.
- **Key advantage**: Doesn't block the event loop, allowing real-time data processing.

### 2. **Forking Processes (`fork`)**
The `fork()` method creates a new Node.js process that shares the same V8 instance as the parent.
- **Use case**: Running separate Node.js scripts with IPC (message passing).
- **Example**: A parent process sends data to a forked child process, and the child returns the result.
- **Key advantage**: Built-in messaging with structured JSON data passing.

### 3. **Executing System Commands (`exec`)**
The `exec()` function allows running shell commands from a Node.js application.
- **Use case**: Running system-level commands (e.g., listing files, searching directories).
- **Example**: `ls -l` command execution to list files in a directory.
- **Key advantage**: Returns entire output as a string but should be used cautiously to avoid command injection risks.

### 4. **Process Communication with IPC**
Inter-process communication (IPC) enables message-based interaction between parent and child processes.
- **Use case**: Sending data from a parent process to a child, processing it, and returning results.
- **Example**: A forked process receives a size parameter, computes a sum, and sends the result back.
- **Key advantage**: Reduces blocking operations and offloads computation-heavy tasks.

### 5. **Error Handling & Performance Measurement**
- **Error Handling**: Ensures child processes exit gracefully, capturing errors and handling timeouts.
- **Performance Tracking**: Uses timestamps to measure execution duration for performance insights.
- **Validation**: Ensures correct parameters before executing processes to prevent crashes.

## Project Structure
```
nodejs-multithreading/
│── scripts/                   # Contains child scripts (Node.js & Python)
│── index.js                   # Main execution file
│── execCommand.js             # Demonstrates exec() for shell commands
│── forkCommand.js             # Demonstrates fork() for IPC communication
│── ChildProcessManager.js     # Handles process execution via spawn()
│── README.md                  # Project documentation
│── package.json               # Node.js dependencies & scripts
```

## Running the Project

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd nodejs-multithreading
   ```

2. **Install dependencies (if any are added in the future):**
   ```sh
   npm install
   ```

3. **Run JavaScript child process:**
   ```sh
   npm run start-js
   ```

4. **Run Python child process:**
   ```sh
   npm run start-python
   ```

5. **Execute shell command example:**
   ```sh
   npm run exec-command
   ```

6. **Run fork process example:**
   ```sh
   npm run fork-command
   ```

## Conclusion
This repository serves as a practical guide to handling multithreading and process management in Node.js. By understanding how to use child processes efficiently, you can improve application performance and handle computational tasks effectively.

