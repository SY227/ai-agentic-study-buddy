export const SummarizePromptStrict = `
Return ONLY valid JSON (double-quoted keys/strings, no trailing commas), strictly matching:
{
  "videoId": "string",
  "url": "string",
  "title": "string",
  "channel": "string",
  "publishedAt": "string",
  "summary": "string",
  "key_points": ["string"],
  "key_quotes": ["string"],
  "timestamps": [{"time":"MM:SS or HH:MM:SS","point":"string"}],
  "tags": ["string"],
  "confidence": 0.6,
  "source": "youtube"
}`
