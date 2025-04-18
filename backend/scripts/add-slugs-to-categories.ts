import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  // Récupérer toutes les catégories sans slug
  const categories = await prisma.category.findMany();

  for (const cat of categories) {
    if (!cat.slug) {
      // Générer un slug de base à partir du nom ou de l'ID
      let baseSlug = cat.name
        ? slugify(cat.name, { lower: true, strict: true })
        : `category-${cat.id}`;
      let slug = baseSlug;
      let i = 1;
      // S'assurer que le slug est unique
      while (await prisma.category.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${i++}`;
      }
      await prisma.category.update({
        where: { id: cat.id },
        data: { slug },
      });
      console.log(`Category "${cat.name}" (${cat.id}) → slug "${slug}"`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
