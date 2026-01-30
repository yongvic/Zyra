import Link from 'next/link';
import { Heart, MessageCircle, Gamepad2, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
        <div className="text-2xl font-bold text-pink-600">💕 Zyra</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-pink-600 transition">
            Se connecter
          </Link>
          <Link href="/register" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 text-balance">
            Connectez-vous vraiment avec votre partenaire
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Zyra est l'application ultime pour les couples à distance. Jouez ensemble, partagez vos souvenirs, et renforcez votre lien avec du contenu engageant et amusant.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="px-8 py-4 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition"
            >
              Commencer Maintenant
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border-2 border-pink-600 text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition"
            >
              En savoir plus
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-pink-600">7</div>
              <p className="text-gray-600">Jeux interactifs</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">∞</div>
              <p className="text-gray-600">Chat sans limites</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">📸</div>
              <p className="text-gray-600">Murs de souvenirs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Pourquoi Zyra?
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Chat */}
            <div className="flex gap-4">
              <MessageCircle className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Chat Temps Réel</h3>
                <p className="text-gray-600">
                  Communiquez instantanément avec votre partenaire. Messages, photos, et appels vidéo intégrés pour ne jamais vous sentir loin.
                </p>
              </div>
            </div>

            {/* Games */}
            <div className="flex gap-4">
              <Gamepad2 className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">7 Jeux Amusants</h3>
                <p className="text-gray-600">
                  Jouez ensemble: Memory, Truth or Dare, Quiz, Daily Challenges, Plus or Moins, La Roue, et Compliments. Compétition saine et rire garantis!
                </p>
              </div>
            </div>

            {/* Memories */}
            <div className="flex gap-4">
              <Heart className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Mur des Souvenirs</h3>
                <p className="text-gray-600">
                  Collectionnez et organisez vos photos, dates importantes, et moments spéciaux. Revivez vos souvenirs avec votre timeline personnalisée.
                </p>
              </div>
            </div>

            {/* Playlist */}
            <div className="flex gap-4">
              <Sparkles className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Playlist Partagée</h3>
                <p className="text-gray-600">
                  Créez une playlist ensemble. Découvrez la musique du moment, écoutez ensemble, et partagez vos chansons préférées.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à renforcer votre lien?</h2>
          <p className="text-lg mb-8 opacity-90">
            Rejoignez des milliers de couples qui utilisent Zyra pour rester connectés et s'amuser ensemble.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-pink-600 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-center">
        <p>&copy; 2026 Zyra. Fait avec 💕 pour les couples à distance.</p>
      </footer>
    </main>
  );
}
