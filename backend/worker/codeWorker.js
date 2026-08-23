// require("dotenv").config();
// const { Worker } = require("bullmq");
// const IORedis = require("ioredis");

// const {
//   executeCode,
// } = require("../services/codeExecutionService");

// const connection = new IORedis(process.env.REDIS_URL, {
//   maxRetriesPerRequest: null,
// });

// const worker = new Worker(
//   "code-execution",

//   async (job) => {
//     console.log("Executing job:", job.id);

//     const { language, code, input } = job.data;

//     const result = await executeCode({
//       code,
//       language,
//       input,
//     });

//     return result;
//   },

//   {
//     connection,
//   }
// );

// worker.on("completed", (job) => {
//   console.log(`Job ${job.id} completed`);
// });

// worker.on("failed", (job, err) => {
//   console.error(`Job ${job?.id} failed:`, err);
// });

// console.log("Code execution worker started...");