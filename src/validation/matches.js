import { z } from 'zod';

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

const isoDateStringSchema = z.string().refine(
  (value) => {
    const isoDateTimePattern =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
    return isoDateTimePattern.test(value) && !Number.isNaN(Date.parse(value));
  },
  'Must be a valid ISO date string',
);

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, 'sport is required'),
    homeTeam: z.string().trim().min(1, 'homeTeam is required'),
    awayTeam: z.string().trim().min(1, 'awayTeam is required'),
    startTime: isoDateStringSchema,
    endTime: isoDateStringSchema,
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((value, ctx) => {
    const startTimestamp = Date.parse(value.startTime);
    const endTimestamp = Date.parse(value.endTime);

    if (!Number.isNaN(startTimestamp) && !Number.isNaN(endTimestamp) && endTimestamp <= startTimestamp) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'endTime must be after startTime',
      });
    }
  });

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
