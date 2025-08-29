import { z } from 'zod';
export const VideoSummarySchema = z.object({
  videoId: z.string(),
  url: z.string().url(),
  title: z.string().optional().default(''),
  channel: z.string().optional().default(''),
  publishedAt: z.string().optional().default(''),
  summary: z.string(),
  key_points: z.array(z.string()).default([]),
  key_quotes: z.array(z.string()).default([]),
  timestamps: z.array(z.object({ time: z.string(), point: z.string() })).default([]),
  tags: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).default(0.6),
  source: z.string().default('youtube')
});
export type VideoSummary = z.infer<typeof VideoSummarySchema>;
