export async function fetchYoutubeTranscript(inputUrl: string): Promise<string> {
  try {
    const url = new URL(inputUrl);
    let v = '';
    if (url.hostname === 'youtu.be') v = url.pathname.slice(1);
    else if (url.searchParams.get('v')) v = url.searchParams.get('v') || '';
    else {
      const parts = url.pathname.split('/');
      v = parts.includes('shorts') ? parts[parts.indexOf('shorts') + 1] : '';
    }
    if (!v) return '';
    const attempts = [
      "https://video.google.com/timedtext?lang=en&v=" + v,
      "https://video.google.com/timedtext?lang=en&kind=asr&v=" + v,
      "https://video.google.com/timedtext?lang=en-US&v=" + v,
      "https://video.google.com/timedtext?lang=en-US&kind=asr&v=" + v
    ];
    for (const api of attempts) {
      const xml = await (await fetch(api)).text();
      if (xml && !xml.includes('<transcript/>')) {
        return xml
          .replace(/<\/?text[^>]*>/g, '\n')
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\n{2,}/g, '\n')
          .trim();
      }
    }
    return '';
  } catch {
    return '';
  }
}
