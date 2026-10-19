// Shots persist in IndexedDB as blobs (a 12 MP data URL is a multi-megabyte string).
// 'shots' holds small records (id, time, camera, thumbnail blob) so the grid stays light; 'full' holds the full-size JPEG blob.
const newestFirst = list => list.slice().sort((a, b) => b.t - a.t);

const shotStore = (() => {
  const open = () => new Promise((ok, no) => {
    const r = indexedDB.open('nomoney', 1);
    r.onupgradeneeded = () => { r.result.createObjectStore('shots', { keyPath: 'id' }); r.result.createObjectStore('full'); };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });
  const run = async (mode, fn) => {
    const db = await open();
    return new Promise((ok, no) => {
      const tx = db.transaction(['shots', 'full'], mode);
      const out = fn(tx.objectStore('shots'), tx.objectStore('full'));
      tx.oncomplete = () => { db.close(); ok(out && out.result); };
      tx.onerror = tx.onabort = () => { db.close(); no(tx.error); };
    });
  };
  return {
    add: (rec, blob) => run('readwrite', (s, f) => { f.put(blob, rec.id); return s.put(rec); }),
    all: () => run('readonly', s => s.getAll()).then(newestFirst),
    full: id => run('readonly', (s, f) => f.get(id)),
    remove: id => run('readwrite', (s, f) => { f.delete(id); return s.delete(id); })
  };
})();

if (typeof module !== 'undefined') module.exports = { newestFirst };
