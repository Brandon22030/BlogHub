import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await prisma.category.createMany({
    const categories = [
      { name: "Food", slug: "food", imageUrl: "/categories/food.svg" },
      { name: "Animal", slug: "animal", imageUrl: "/categories/animal.svg" },
      { name: "Car", slug: "car", imageUrl: "/categories/car.svg" },
      { name: "Sport", slug: "sport", imageUrl: "/categories/sport.svg" },
      { name: "Music", slug: "music", imageUrl: "/categories/music.svg" },
      { name: "Technology", slug: "technology", imageUrl: "/categories/techno.svg" },
      { name: "Abstract", slug: "abstract", imageUrl: "/categories/abstract.svg" },
      { name: "Anime", slug: "anime", imageUrl: "/categories/anime.png" },
      { name: "Games", slug: "games", imageUrl: "/categories/game.jpg" },
    ];
  // });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name, imageUrl: category.imageUrl },
      update: {},
      create: category,
    });
  }

  console.log("✅ Catégories ajoutées avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
