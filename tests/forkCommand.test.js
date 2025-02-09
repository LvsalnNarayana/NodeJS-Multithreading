import { fork } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

describe("Fork Child Process", () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const rootDir = path.resolve(__dirname, "..");
  const childScriptPath = path.resolve(rootDir, "scripts", "child-script.js");

  test("should receive a message from child process", (done) => {
    const child = fork(childScriptPath);

    child.on("message", (msg) => {
      console.log("Received from child:", msg);
      expect(msg).toBeDefined();
      expect(msg).toHaveProperty("data");
      child.disconnect();
      child.kill();
      done();
    });

    child.send({ size: 100 });
  }, 10000);

  test("should handle child process errors", (done) => {
    const invalidChild = fork("invalid-script.js", { silent: true });

    invalidChild.on("error", (err) => {
      console.error("Child Process Error:", err);
      expect(err).toBeDefined();
      done();
    });

    invalidChild.on("exit", (code) => {
      console.log("Child exited with code:", code);
      expect(code).not.toBe(0); // Expect failure
      done();
    });
  }, 10000);

  test("should exit with code 0 on success", (done) => {
    const child = fork(childScriptPath);

    child.on("message", (message) => {
      console.log("Child process success message:", message);
      expect(message).toBeDefined();
      expect(message.data).toBe(4950);
      child.disconnect();
      child.kill();
      done();
    });

    child.send({ size: 100 });
  }, 20000);

  test("should log error if child process exits with non-zero code", (done) => {
    const child = fork(childScriptPath, { silent: true });

    child.on("exit", (code) => {
      console.log("Child process exited with code:", code);
      expect(code).not.toBe(0);
      done();
    });

    child.send({ error: true });
  }, 20000);
});
