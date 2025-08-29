export async function withBackoff<T>(fn: () => Promise<T>, attempts = 3, baseMs = 600): Promise<T> {
  let last: any
  for (let i=0;i<attempts;i++){
    try { return await fn() } catch(e){ last = e; await new Promise(r=>setTimeout(r, baseMs * Math.pow(2,i) + Math.random()*200)) }
  }
  throw last
}
