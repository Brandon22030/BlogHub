import { MongoClient } from 'mongodb';

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; // Mets ici ta vraie URI si besoin
  const dbName = process.env.MONGODB_DB || 'Cluster0'; // Mets ici le nom de ta base
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection('Category').updateMany(
      { slug: null },
      { $unset: { slug: "" } }
    );
    console.log(`Documents modifiés : ${result.modifiedCount}`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
