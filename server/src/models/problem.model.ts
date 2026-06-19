import mongoose, { Schema } from "mongoose";

const ProblemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    tags: [
      {
        type: String,
        enum: ["array", "linkedList", "graph", "dp"],
        required: true,
      },
    ],

    visibleTestCases: [
      {
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
          required: true,
        },
      },
    ],

    hiddenTestCases: [
      {
        input: {
          type: String,
          required: true,
        },

        output: {
          type: String,
          required: true,
        },
      },
    ],

    startCode: [
      {
        language: {
          type: String,
          required: true,
        },

        initialCode: {
          type: String,
          required: true,
        },
      },
    ],

    referenceSolution: [
      {
        language: {
          type: String,
          required: true,
        },

        completeCode: {
          type: String,
          required: true,
        },
      },
    ],

    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model("Problem", ProblemSchema);

export default Problem;