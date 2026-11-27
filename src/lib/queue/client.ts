import { Queue } from "bullmq";
import connection from "./redis";

export const flowQueue = new Queue("flow-execution", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
    },
});