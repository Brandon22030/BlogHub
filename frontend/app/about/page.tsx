import { NavBar } from "../../components/navBar";

// import Pages from "../../components/pages";
import Breadcrumbs from "@/components/breadcrumbs";

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <Breadcrumbs />
      {/* <div className="flex justify-center">
        <Pages current="about" />
      </div> */}
      <main className="min-h-screen">
        {/* Section intro */}
        <section className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 mt-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[#FC4308]">
              BlogHub : la plateforme de blogs moderne et ouverte à tous
            </h1>
            <p className="mb-4 text-gray-700">
              BlogHub est une plateforme de blogging innovante développée par
              une équipe passionnée, réunissant développeurs, designers et
              experts du digital. Notre mission : offrir à chacun un espace
              simple, performant et sécurisé pour partager ses idées, ses
              passions et son expertise.
              <br />
              <br />
              Propulsé par une stack moderne (NestJS, Next.js, Prisma), BlogHub
              mise sur l’expérience utilisateur, la rapidité et la
              personnalisation. Nous croyons à l’ouverture, à la liberté
              d’expression et à la création de communautés positives. Que vous
              soyez auteur débutant ou blogueur confirmé, BlogHub vous
              accompagne avec des outils puissants (gestion de contenus,
              commentaires, recherche avancée, SEO, dark mode…) et un support
              réactif.
              <br />
              <br />
              Notre équipe s’engage à améliorer constamment la plateforme, à
              écouter vos retours et à construire un espace où chaque voix
              compte. Rejoignez-nous et faites entendre la vôtre !
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
