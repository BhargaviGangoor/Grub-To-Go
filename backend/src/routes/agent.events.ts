import { Router, Request, Response } from "express";
import { agentStreamManager } from "../services/AgentStreamManager";

const router = Router();

router.get("/runs/:runId/events", (req: Request, res: Response): void => {
  const { runId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // Send initial connected event
  res.write(`data: ${JSON.stringify({ type: "CONNECTED", runId, timestamp: Date.now() })}\n\n`);

  const unsubscribe = agentStreamManager.subscribe(runId, (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  req.on("close", () => {
    unsubscribe();
  });
});

export default router;
