import { Worker } from "bullmq";
import connection from "@/lib/queue/redis";
import { executeFlow } from "@/lib/execution-engine";
import connectToDatabase from "@/lib/db";

const worker = new Worker(
  "flow-execution",
  async (job) => {
    console.log(`Processing job ${job.id} for flow ${job.data.flowId}`);
    try {
      await connectToDatabase();
      await executeFlow(
        job.data.flowId,
        job.data.triggerData,
        job.data.executionId
      );
      console.log(`Job ${job.id} completed `);
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} has failed with ${err.message}`);
});

console.log("Worker started...");