// const axios = require("axios");

// const runCode = async (req, res) => {
//     try {
//         const { language, code, input } = req.body;

//         const response = await axios.post(
//             "https://emkc.org/api/v2/piston/execute",
//             {
//                 language,
//                 version: "*",
//                 files: [
//                     {
//                         content: code,
//                     },
//                 ],
//                 stdin: input || "",
//             }
//         );

//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error(error.response?.data || error.message);

// res.status(500).json({
//     message: "Error executing code",
//     error: error.response?.data || error.message,
// });
//     }
// };

// // module.exports = { runCode };
// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const runCode = async (req, res) => {
//     try {
//         const { code } = req.body;
//         console.log("API HIT");

//         // const filePath = path.join(__dirname, "../temp/main.cpp");
//         const filePath = "C:\\Temp\\CodeArena\\main.cpp";

//         fs.writeFileSync(filePath, code);

// console.log("File written");

//       //  const exePath = path.join(__dirname, "../temp/main.exe");
//       const exePath = "C:\\Temp\\CodeArena\\main.exe";
// console.log("Starting compilation");
// exec(
//     `g++ "${filePath}" -o "${exePath}"`,
//     (compileError, stdout, stderr) => {
// console.log("Compilation callback");
//         console.log("compileError:", compileError);
// console.log("stdout:", stdout);
// console.log("stderr:", stderr);

// if (compileError) {
//     return res.status(400).json({
//         error: stderr,
//     });
// }

// console.log("Running exe");
//         exec(`"${exePath}"`, (runError, runStdout, runStderr) => {
//            console.log("Run callback");
//     if (runError) {
//         return res.status(400).json({
//             error: runStderr,
//         });
//     }
//  console.log(runStdout);
//     return res.status(200).json({
//         output: runStdout,
//     });
// });
//     }
// );

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             message: "Something went wrong",
//         });
//     }
// };

// module.exports = { runCode };
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const runCode = async (req, res) => {
    try {
        const { code } = req.body;

        console.log("API HIT");

        // Create a temporary folder outside the project
        const tempDir = path.join(os.tmpdir(), "CodeArena");

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const filePath = path.join(tempDir, "main.cpp");
        const exePath = path.join(tempDir, "main.exe");

        // Write code to file
        fs.writeFileSync(filePath, code);

        console.log("File written");
        console.log("Starting compilation");

        exec(
            `g++ "${filePath}" -o "${exePath}"`,
            (compileError, stdout, stderr) => {

                console.log("Compilation callback");

                if (compileError) {
                    console.error(stderr);

                    return res.status(400).json({
                        error: stderr || compileError.message,
                    });
                }

                console.log("Running executable");

                exec(`"${exePath}"`, (runError, runStdout, runStderr) => {

                    console.log("Run callback");

                    if (runError) {
                        console.error(runError);

                        return res.status(400).json({
                            error: runStderr || runError.message,
                        });
                    }

                    console.log(runStdout);

                    return res.status(200).json({
                        output: runStdout,
                    });
                });
            }
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = { runCode };