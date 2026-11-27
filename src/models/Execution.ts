import mongoose, { Schema, model, models } from "mongoose";

const ExecutionSchema = new Schema(
  {
    flowId: {
      type: Schema.Types.ObjectId,
      ref: "Flow",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },
    steps: [
      {
        nodeId: String,
        nodeType: String,
        status: {
          type: String,
          enum: ["pending", "running", "completed", "failed"],
        },
        output: Schema.Types.Mixed,
        error: String,
        startedAt: Date,
        completedAt: Date,
      },
    ],
    triggerData: {
      type: Schema.Types.Mixed,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Execution = models.Execution || model("Execution", ExecutionSchema);

export default Execution;