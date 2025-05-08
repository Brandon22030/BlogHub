// Script Node.js pour afficher les articles et leur structure (debug)
import fetch from "node-fetch";

(async () => {
  const res = await fetch("https://bloghub-8ljb.onrender.com/articles");
  const data = await res.json();
  console.dir(data, { depth: 10 });
})();
