const { spawn } = require("child_process");
const crypto = require("crypto");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const COMPILE_TIMEOUT_MS = 30_000;
const DOCKER_RUN_TIMEOUT_MS = 30_000;
const PROGRAM_TIMEOUT_SECONDS = 5;
const TIMEOUT_MARKER = "__CODEARENA_TIMEOUT__";

const executionRoot =
  process.env.EXECUTION_ROOT ||
  (process.platform === "win32"
    ? "C:\\codearena-execution-temp"
    : path.join(os.tmpdir(), "codearena-execution-temp"));

const LANGUAGE_CONFIG = {
  cpp: {
    fileName: "main.cpp",
    image: "gcc:latest",

    buildCommand: "sh",
    buildArgs: ["-c", "g++ main.cpp -std=c++17 -O2 -o main"],

    runCommand: "sh",
   runArgs: [
  "-c",
  [
    `timeout -k 1s ${PROGRAM_TIMEOUT_SECONDS}s ./main`,
    "exitCode=$?",
    `if [ "$exitCode" -eq 124 ] || [ "$exitCode" -eq 137 ]; then`,
    `  echo "${TIMEOUT_MARKER}" >&2`,
    "  exit 124",
    "fi",
    'exit "$exitCode"',
  ].join("\n"),
],
  },

  python: {
    fileName: "main.py",
  },

  javascript: {
    fileName: "main.js",
  },

  java: {
    fileName: "Main.java",
  },
};

function forceRemoveContainer(containerName) {
  const cleanup = spawn(
    "docker",
    ["rm", "-f", containerName],
    {
      shell: false,
      windowsHide: true,
      stdio: "ignore",
    }
  );

  cleanup.on("error", () => {});
}

function runDockerProcess({
  image,
  sourceDir,
  command,
  args = [],
  input = "",
  timeoutMs,
}) {
  return new Promise((resolve) => {
    const containerName = `codearena-${crypto.randomUUID()}`;

    const dockerArgs = [
      "run",
      "--rm",
      "--name",
      containerName,
      "-i",

      // Basic isolation. Docker-based execution still needs further hardening.
      "--network",
      "none",
      "--memory",
      "256m",
      "--cpus",
      "0.5",
      "--pids-limit",
      "64",

      "-v",
      `${sourceDir}:/code`,
      "-w",
      "/code",

      image,
      command,
      ...args,
    ];

    console.log("[docker] starting", {
      sourceDir,
      containerName,
      timeoutMs,
      dockerArgs,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let finished = false;

    const child = spawn("docker", dockerArgs, {
      cwd: sourceDir,
      shell: false,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const timer = setTimeout(() => {
      timedOut = true;

      console.warn("[docker] host timeout reached", {
        containerName,
        timeoutMs,
      });

      // Stops the container even if killing the Docker CLI alone is insufficient.
      forceRemoveContainer(containerName);
      child.kill();
    }, timeoutMs);

    function finish(result) {
      if (finished) return;

      finished = true;
      clearTimeout(timer);

      const dockerResult = {
        stdout,
        stderr,
        timedOut,
        ...result,
      };

      console.log("[docker] finished", dockerResult);
      resolve(dockerResult);
    }

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      finish({
        exitCode: null,
        spawnError: error.message,
      });
    });

    child.on("close", (exitCode, signal) => {
      finish({
        exitCode,
        signal,
        spawnError: null,
      });
    });

    child.stdin.on("error", () => {});

    // Close stdin for compilation. Send and close it for program execution.
    if (input !== null) {
      child.stdin.end(input);
    } else {
      child.stdin.end();
    }
  });
}

async function executeCode({ language, code, input }) {
  const config = LANGUAGE_CONFIG[language];

  if (!config) {
    return {
      status: "validation_error",
      stdout: "",
      stderr: `Unsupported language: ${language}`,
    };
  }

  if (!config.image) {
    return {
      status: "configuration_error",
      stdout: "",
      stderr: `Docker execution is not configured for ${language} yet.`,
    };
  }

  await fs.mkdir(executionRoot, { recursive: true });

  const tempDir = await fs.mkdtemp(
    path.join(executionRoot, "codearena-")
  );

  const sourcePath = path.join(tempDir, config.fileName);

  try {
    await fs.writeFile(sourcePath, code, "utf8");

    const compilation = await runDockerProcess({
      image: config.image,
      sourceDir: tempDir,
      command: config.buildCommand,
      args: config.buildArgs,
      input: null,
      timeoutMs: COMPILE_TIMEOUT_MS,
    });

    if (compilation.timedOut) {
      return {
        status: "timeout",
        stdout: compilation.stdout,
        stderr: compilation.stderr || "Compilation timed out.",
      };
    }

    if (
      compilation.spawnError ||
      compilation.exitCode !== 0
    ) {
      return {
        status: "compilation_error",
        stdout: compilation.stdout,
        stderr:
          compilation.stderr ||
          compilation.spawnError ||
          "Compilation failed.",
      };
    }

    const execution = await runDockerProcess({
      image: config.image,
      sourceDir: tempDir,
      command: config.runCommand,
      args: config.runArgs,
      input: input ?? "",
      timeoutMs: DOCKER_RUN_TIMEOUT_MS,
    });

    const programTimedOut =
      execution.timedOut ||
      execution.exitCode === 124 ||
      execution.stderr.includes(TIMEOUT_MARKER);

    if (programTimedOut) {
      return {
        status: "timeout",
        stdout: execution.stdout,
        stderr: "Execution timed out.",
      };
    }

    if (
      execution.spawnError ||
      execution.exitCode !== 0
    ) {
      return {
        status: "runtime_error",
        stdout: execution.stdout,
        stderr:
          execution.stderr ||
          execution.spawnError ||
          `Process exited with code ${execution.exitCode}.`,
      };
    }

    return {
      status: "success",
      stdout: execution.stdout,
      stderr: execution.stderr,
    };
  } finally {
    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });
  }
}

module.exports = {
  executeCode,
  SUPPORTED_LANGUAGES: Object.keys(LANGUAGE_CONFIG),
};