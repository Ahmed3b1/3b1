import Flow from "@/models/Flow";
import Execution from "@/models/Execution";
import connectToDatabase from "@/lib/db";
import { FlowExecutor } from "@/lib/workflow/executor";
import { Workflow } from "@/lib/workflow/types";

export async function executeFlow(
  flowId: string,
  triggerData: any,
  executionId?: string
) {
  await connectToDatabase();

  const flowDoc = await Flow.findOne({ _id: flowId });
  if (!flowDoc) throw new Error("Flow not found");

  const flow: Workflow = {
    id: flowDoc._id.toString(),
    nodes: flowDoc.nodes || [],
    edges: flowDoc.edges || [],
  };

  let execution;
  if (executionId) {
    execution = await Execution.findById(executionId);
    if (!execution) throw new Error("Execution not found");

    await Execution.findByIdAndUpdate(executionId, {
      status: "running",
      startedAt: new Date(),
    });
  } else {
    execution = await Execution.create({
      flowId: flowDoc._id,
      status: "running",
      triggerData,
      steps: [],
    });
  }

  try {
    const executer = new FlowExecutor(flow, triggerData);
    const resultContext = await executer.execute();

    const steps = Object.entries(resultContext.steps).map(
      ([nodeId, output]) => ({
        nodeId,
        status: "completed",
        output,
        completedAt: new Date(),
      })
    );

    await Execution.findByIdAndUpdate(execution._id, {
      status: "completed",
      completedAt: new Date(),
      steps,
    });

    return resultContext;
  } catch (error: any) {
    await Execution.findByIdAndUpdate(execution._id, {
      status: "failed",
      completedAt: new Date(),
      error: error.message,
    });
    throw error;
  }
}