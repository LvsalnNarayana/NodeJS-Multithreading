/**
 * Child Process Calculator
 *
 * Calculates sum of numbers from 0 to N-1 using either:
 * - fork() for IPC communication
 * - spawn() for CLI execution
 */

function calculateSum(size) {
  try {
    // Using arithmetic progression formula: sum = (n-1)*n/2
    return ((size - 1) * size) / 2;
  } catch (error) {
    process.stderr.write(
      JSON.stringify({
        status: "error",
        message: error.message || "Sum calculation failed",
      }) + "\n"
    );
    process.exit(1);
  }
}

// Handle fork() communication
process.on("message", (msg) => {
  if (msg?.size && Number.isInteger(msg.size) && msg.size > 0) {
    const startTime = process.hrtime(); // Start timer

    const result = calculateSum(msg.size);

    const endTime = process.hrtime(startTime); // End timer
    const timeTakenMs = endTime[0] * 1e3 + endTime[1] / 1e6; // Convert to milliseconds

    process.send({
      status: "success",
      data: result,
      calculation: `Sum of 0-${msg.size - 1}`,
      timeTakenMs: `${timeTakenMs.toFixed(3)} ms`, // Execution time in ms
    });
  } else {
    process.send({
      status: "error",
      message: "Invalid size parameter. Must be a positive integer.",
      received: msg,
    });
    process.exit(1);
  }
});

// Handle spawn() execution
if (typeof process.send !== "function") {
  const [_, __, sizeArg] = process.argv;

  // Validate input
  const size = parseInt(sizeArg, 10);
  if (isNaN(size) || size <= 0) {
    process.stderr.write(
      JSON.stringify({
        status: "error",
        message: "Invalid size argument. Please provide a positive integer.",
        received: sizeArg,
      }) + "\n"
    );
    process.exit(1);
  }

  // Calculate and output result
  const result = calculateSum(size);
  process.stdout.write(result.toString());
}

// Process identification
// if (typeof process.send === "function") {
//   console.log("[Child] Running in fork mode - awaiting messages");
// } else {
//   console.log("[Child] Running in spawn mode - processing CLI input");
// }
