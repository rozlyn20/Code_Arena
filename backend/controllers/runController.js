const {
  executeCode,
  SUPPORTED_LANGUAGES,
} = require("../services/codeExecutionService");

const runCode = async (req, res) => {
  try {
    const { code, language, input } = req.body || {};

    if (typeof code !== "string") {
      return res.status(400).json({
        status: "validation_error",
        stdout: "",
        stderr: "Code must be a string.",
      });
    }

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        status: "validation_error",
        stdout: "",
        stderr: `Supported languages: ${SUPPORTED_LANGUAGES.join(", ")}`,
      });
    }

    if (input !== undefined && input !== null && typeof input !== "string") {
      return res.status(400).json({
        status: "validation_error",
        stdout: "",
        stderr: "Input must be a string.",
      });
    }

    const result = await executeCode({
      code,
      language,
      input: input ?? "",
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Code execution failed:", error);

    return res.status(500).json({
      status: "internal_error",
      stdout: "",
      stderr: "The server could not execute the submitted code.",
    });
  }
};

module.exports = { runCode };
// const { codeQueue } = require("../queue/codeQueue");

// const {
//   SUPPORTED_LANGUAGES,
// } = require("../services/codeExecutionService");

// const runCode = async (req, res) => {
//   try {
//     const { code, language, input } = req.body || {};

//     if (typeof code !== "string") {
//       return res.status(400).json({
//         status: "validation_error",
//         stdout: "",
//         stderr: "Code must be a string.",
//       });
//     }

//     if (!SUPPORTED_LANGUAGES.includes(language)) {
//       return res.status(400).json({
//         status: "validation_error",
//         stdout: "",
//         stderr: `Supported languages: ${SUPPORTED_LANGUAGES.join(", ")}`,
//       });
//     }

//     if (
//       input !== undefined &&
//       input !== null &&
//       typeof input !== "string"
//     ) {
//       return res.status(400).json({
//         status: "validation_error",
//         stdout: "",
//         stderr: "Input must be a string.",
//       });
//     }

//     const job = await codeQueue.add("execute-code", {
//       code,
//       language,
//       input: input ?? "",
//     });

//     return res.status(202).json({
//       status: "queued",
//       jobId: job.id,
//     });

//   } catch (error) {
//     console.error("Failed to queue code execution:", error);

//     return res.status(500).json({
//       status: "internal_error",
//       stdout: "",
//       stderr: "The server could not queue the submitted code.",
//     });
//   }
// };
// const getRunResult = async (req, res) => {
//   try {
//     const { jobId } = req.params;

//     const job = await codeQueue.getJob(jobId);

//     if (!job) {
//       return res.status(404).json({
//         status: "not_found",
//         message: "Execution job not found.",
//       });
//     }

//     const state = await job.getState();

//     if (state === "completed") {
//       return res.status(200).json({
//         status: "completed",
//         result: job.returnvalue,
//       });
//     }

//     if (state === "failed") {
//       return res.status(200).json({
//         status: "failed",
//         result: {
//           stdout: "",
//           stderr: job.failedReason || "Code execution failed.",
//         },
//       });
//     }

//     return res.status(200).json({
//       status: state,
//     });

//   } catch (error) {
//     console.error("Failed to get execution result:", error);

//     return res.status(500).json({
//       status: "internal_error",
//       message: "Could not retrieve execution result.",
//     });
//   }
// };

// module.exports = { runCode,getRunResult };