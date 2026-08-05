const { spawn } = require("child_process");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const TIMEOUT_MS = 5000;

const LANGUAGE_CONFIG = {
  cpp: {
    fileName: "main.cpp",
    build({ sourcePath, tempDir }) {
      const executablePath = path.join(
        tempDir,
        process.platform === "win32" ? "main.exe" : "main",
      );

      return {
        command: "g++",
        args: [sourcePath, "-std=c++17", "-O2", "-o", executablePath],
        executablePath,
      };
    },
    run({ executablePath }) {
      return { command: executablePath, args: [] };
    },
  },

  python: {
    fileName: "main.py",
    run({ sourcePath }) {
      return {
        command:
          process.env.PYTHON_BIN ||
          (process.platform === "win32" ? "python" : "python3"),
        args: [sourcePath],
      };
    },
  },

  javascript: {
    fileName: "main.js",
    run({ sourcePath }) {
      return { command: process.execPath, args: [sourcePath] };
    },
  },

  java: {
    fileName: "Main.java",
    build({ sourcePath }) {
      return { command: "javac", args: [sourcePath] };
    },
    run({ tempDir }) {
      return { command: "java", args: ["-cp", tempDir, "Main"] };
    },
  },
};

function runProcess(command, args, { cwd, input = "", timeoutMs = TIMEOUT_MS }) {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let finished = false;
    let timer;

    const finish = (result) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, timedOut, ...result });
    };

    const child = spawn(command, args, {
      cwd,
      shell: false,
      windowsHide: true,
    });

    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      finish({
        exitCode: null,
        spawnError: error.message,
      });
    });

    child.on("close", (exitCode) => {
      finish({
        exitCode,
        spawnError: null,
      });
    });

    timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);

    child.stdin?.on("error", () => {});
    child.stdin?.end(input);
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

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "codearena-"));
  const sourcePath = path.join(tempDir, config.fileName);

  try {
    await fs.writeFile(sourcePath, code, "utf8");

    let executablePath;

    if (config.build) {
      const buildCommand = config.build({ sourcePath, tempDir });
      executablePath = buildCommand.executablePath;

      const compilation = await runProcess(buildCommand.command, buildCommand.args, {
        cwd: tempDir,
      });

      if (compilation.timedOut) {
        return {
          status: "timeout",
          stdout: compilation.stdout,
          stderr: compilation.stderr || "Compilation timed out.",
        };
      }

      if (compilation.spawnError || compilation.exitCode !== 0) {
        return {
          status: "compilation_error",
          stdout: compilation.stdout,
          stderr: compilation.stderr || compilation.spawnError || "Compilation failed.",
        };
      }
    }

    const runCommand = config.run({ sourcePath, tempDir, executablePath });

    const execution = await runProcess(runCommand.command, runCommand.args, {
      cwd: tempDir,
      input,
    });

    if (execution.timedOut) {
      return {
        status: "timeout",
        stdout: execution.stdout,
        stderr: execution.stderr || "Execution timed out.",
      };
    }

    if (execution.spawnError || execution.exitCode !== 0) {
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
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

module.exports = {
  executeCode,
  SUPPORTED_LANGUAGES: Object.keys(LANGUAGE_CONFIG),
};