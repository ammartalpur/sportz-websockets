import { Router } from "express";
import { desc, eq } from "drizzle-orm";

import { matchIdParamSchema } from "../validation/matches.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";

import { commentary } from "../db/schema.js";
import { db } from "../db/db.js";

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

commentaryRouter.get("/", async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: "Invalid match id parameter.",
      details: JSON.stringify(paramsResult.error),
    });
  }

  const queryResult = listCommentaryQuerySchema.safeParse(req.query);

  if (!queryResult.success) {
    return res.status(400).json({
      error: "Invalid query parameters.",
      details: JSON.stringify(queryResult.error),
    });
  }

  try {
    const requestedLimit = queryResult.data.limit ?? 100;
    const limit = Math.min(requestedLimit, MAX_LIMIT);

    const commentaryList = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, paramsResult.data.id))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    return res.status(200).json({
      data: commentaryList,
    });
  } catch (error) {
    console.error("Failed to fetch commentary:", error);

    return res.status(500).json({
      error: "Failed to fetch commentary.",
    });
  }
});

commentaryRouter.post("/", async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: "Invalid match id parameter.",
      details: JSON.stringify(paramsResult.error),
    });
  }

  const bodyResult = createCommentarySchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: JSON.stringify(bodyResult.error),
    });
  }

  try {
    const [createdCommentary] = await db
      .insert(commentary)
      .values({
        matchId: paramsResult.data.id,
        ...bodyResult.data,
        metadata: bodyResult.data.metadata ?? {},
        tags: bodyResult.data.tags ?? [],
      })
      .returning();

    if (res.app.locals.broadcastCommentary) { 
      res.app.locals.broadcastCommentary(
        createdCommentary.matchId,
        createdCommentary,
      );
    }

    return res.status(201).json({
      data: createdCommentary,
    });
  } catch (error) {
    console.error("Failed to create commentary:", error);

    return res.status(500).json({
      error: "Failed to create commentary.",
    });
  }
});
