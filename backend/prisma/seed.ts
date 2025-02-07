import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await prisma.category.createMany({
    const categories = [
      { name: "Food", imageUrl: "/categories/food.svg" },
      { name: "Animal", imageUrl: "/categories/animal.svg" },
      { name: "Car", imageUrl: "/categories/car.svg" },
      { name: "Sport", imageUrl: "/categories/sport.svg" },
      { name: "Music", imageUrl: "/categories/music.svg" },
      { name: "Technology", imageUrl: "/categories/techno.svg" },
      { name: "Abstract", imageUrl: "/categories/abstract.svg" },
      { name: "Anime", imageUrl: "/categories/anime.png" },
      { name: "Games", imageUrl: "/categories/game.jpg" },
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
