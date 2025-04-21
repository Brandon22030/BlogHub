"use client";
import { NavBar } from "../../components/navBar";
import Breadcrumbs from "@/components/breadcrumbs";

export default function FAQPage() {
  return (
    <>
      <NavBar />
      <Breadcrumbs />
      <main className="max-w-3xl mx-auto px-4 py-12 min-h-[70vh]">
        <h1 className="text-3xl font-bold text-[#FC4308] mb-8 text-center">
          FAQ
        </h1>
        <div className="space-y-7">
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              Qu'est-ce que BlogHub&nbsp;?
            </h2>
            <p className="text-gray-700">
              BlogHub est une plateforme moderne pour créer, partager et
              découvrir des articles de blog, avec une interface intuitive et
              des fonctionnalités avancées.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              Comment puis-je publier un article&nbsp;?
            </h2>
            <p className="text-gray-700">
              Inscrivez-vous, connectez-vous puis accédez à la section "Publier"
              du tableau de bord pour rédiger et publier vos articles avec
              l’éditeur riche.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              Puis-je ajouter des images à mes articles&nbsp;?
            </h2>
            <p className="text-gray-700">
              Oui, l’éditeur permet d’ajouter facilement des images via le
              module d’upload intégré.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              Comment contacter le support&nbsp;?
            </h2>
            <p className="text-gray-700">
              Utilisez la page Contact pour envoyer un message à notre équipe.
              Nous vous répondrons rapidement.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
