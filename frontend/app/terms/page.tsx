"use client";
import { NavBar } from "../../components/navBar";
import Breadcrumbs from "../../components/breadcrumbs";

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <Breadcrumbs />
      <main className="max-w-3xl mx-auto px-4 py-12 min-h-[70vh]">
        <h1 className="text-3xl font-bold text-[#FC4308] mb-8 text-center">
          Conditions Générales d'Utilisation
        </h1>
        <section className="bg-white rounded-xl shadow p-6 border border-gray-100 space-y-6">
          <div>
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              1. Acceptation
            </h2>
            <p className="text-gray-700">
              En utilisant BlogHub, vous acceptez sans réserve les présentes
              conditions générales. Veuillez les lire attentivement avant toute
              utilisation.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              2. Utilisation du Service
            </h2>
            <p className="text-gray-700">
              Vous vous engagez à utiliser BlogHub dans le respect des lois en
              vigueur et à ne pas publier de contenus illicites, offensants ou
              portant atteinte aux droits d’autrui.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              3. Propriété intellectuelle
            </h2>
            <p className="text-gray-700">
              Les contenus publiés sur BlogHub restent la propriété de leurs
              auteurs, mais BlogHub se réserve un droit non exclusif d’affichage
              et de diffusion sur la plateforme.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              4. Limitation de responsabilité
            </h2>
            <p className="text-gray-700">
              BlogHub ne saurait être tenu responsable des contenus publiés par
              les utilisateurs. En cas de problème, contactez-nous via la page
              Contact.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
