"use client";
import { NavBar } from "../../components/navBar";
import Breadcrumbs from "../../components/breadcrumbs";

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <Breadcrumbs />
      <main className="max-w-3xl mx-auto px-4 py-12 min-h-[70vh]">
        <h1 className="text-3xl font-bold text-[#FC4308] mb-8 text-center">
          Politique de Confidentialité
        </h1>
        <section className="bg-white rounded-xl shadow p-6 border border-gray-100 space-y-6">
          <div>
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              Collecte des données
            </h2>
            <p className="text-gray-700">
              Nous collectons uniquement les informations nécessaires à la
              création de votre compte et à l’utilisation de BlogHub (nom,
              email, contenu publié).
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              Utilisation des données
            </h2>
            <p className="text-gray-700">
              Vos données ne sont utilisées que dans le cadre du fonctionnement
              de la plateforme et ne sont jamais revendues à des tiers.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              Sécurité
            </h2>
            <p className="text-gray-700">
              Nous mettons en place des mesures de sécurité avancées pour
              protéger vos informations personnelles.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[#FC4308] mb-2">
              Contact
            </h2>
            <p className="text-gray-700">
              Pour toute question relative à la confidentialité, contactez-nous
              via la page Contact.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
