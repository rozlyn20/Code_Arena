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