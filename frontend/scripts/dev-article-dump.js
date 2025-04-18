// Script Node.js pour afficher les articles et leur structure (debug)
import fetch from 'node-fetch';

(async () => {
  const res = await fetch('http://localhost:3001/articles');
  const data = await res.json();
  console.dir(data, { depth: 10 });
})();
