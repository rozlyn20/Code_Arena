const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        default: "",
    },
});

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true,
    },
    expectedOutput: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        default: "",
    },
    timeLimitMs: {
        type: Number,
        default: 1000,
    },
});

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },
        statement: {
            type: String,
            required: true,
        },
        constraints: [
            {
                type: String,
            },
        ],
        examples: [exampleSchema],
        sampleTestCases: [testCaseSchema],
        hiddenTestCases: [testCaseSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Problem", problemSchema);