import { NavBar } from "../../components/navBar";

// import Pages from "../../components/pages";
import Breadcrumbs from "@/components/breadcrumbs";
import Image from "next/image";

const team = [
  { name: "Brandon", role: "Lead Dev, UX/UI", img: "/avatar.svg" },
  { name: "Cassie Evans", role: "Développeuse", img: "/avatar.svg" },
  { name: "Louis Hoeberigts", role: "Marketing", img: "/avatar.svg" },
  { name: "Patricia", role: "Administratif", img: "/avatar.svg" },
  { name: "James Hoeberigts", role: "CEO", img: "/avatar.svg" },
  { name: "Jon Kantner", role: "Finance", img: "/avatar.svg" },
];

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <Breadcrumbs />
      {/* <div className="flex justify-center">
        <Pages current="about" />
      </div> */}
      <main className="min-h-screen pb-8">
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
          <div className="flex-1 flex justify-center">
            <div className="relative w-[340px] h-[200px] md:w-[400px] md:h-[220px]">
              <Image
                src="/dragndrop.svg"
                fill
                alt="Vidéo de présentation"
                className="rounded-xl object-cover"
              />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 rounded-full p-4 shadow-lg">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="20" fill="#FC4308" />
                  <polygon points="16,13 28,20 16,27" fill="white" />
                </svg>
              </span>
            </div>
          </div>
        </section>

        {/* Section contact + map */}
        <section className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 mt-10 items-start">
          <div className="flex-1 min-w-[250px] bg-white rounded-2xl shadow p-4">
            <Image
              src="https://maps.googleapis.com/maps/api/staticmap?center=Paris,France&zoom=13&size=400x200&key=AIzaSyD..."
              width={400}
              height={200}
              alt="map"
              className="rounded-xl object-cover"
            />
          </div>
          <div className="flex-1 min-w-[250px] bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-2 text-[#FC4308]">
              Mega News Information
            </h2>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>
                <b>Email:</b> management@mega.news
              </li>
              <li>
                <b>Phone:</b> +1234-567-8910
              </li>
              <li>
                <b>Fax:</b> +1234-567-8910
              </li>
              <li>
                <b>Address:</b> 1234 Forum St-New, Levss, 123456
              </li>
              <li>
                <b>Support:</b> 24h/24, 7j/7
              </li>
            </ul>
          </div>
        </section>

        {/* Section équipe */}
        <section className="max-w-5xl mx-auto mt-12">
          <h3 className="text-lg font-semibold mb-6 text-[#FC4308]">
            Mega News Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow flex flex-col items-center p-4"
              >
                <Image
                  src={member.img}
                  width={80}
                  height={80}
                  alt={member.name}
                  className="rounded-xl object-cover mb-2"
                />
                <div className="font-semibold text-gray-800">{member.name}</div>
                <div className="text-xs text-gray-500">{member.role}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
