import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(typeof window !== 'undefined' && localStorage.getItem('platform_logged_in') === 'true');
  }, []);

  if (isLoggedIn) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome, Admin!</h1>
        <p className="text-lg text-gray-700">Use the navigation above to manage Articles, FAQs, and Tests.</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Welcome to Tawasl!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/articles">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow cursor-pointer group">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-book-open text-3xl text-blue-600 group-hover:text-blue-800"></i>
            </div>
            <h2 className="text-xl font-bold text-blue-700 mb-2">Articles</h2>
            <p className="text-gray-600 text-center">Explore expert articles on communication and presentation skills.</p>
          </div>
        </Link>
        <Link href="/faq">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow cursor-pointer group">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-question-circle text-3xl text-blue-600 group-hover:text-blue-800"></i>
            </div>
            <h2 className="text-xl font-bold text-blue-700 mb-2">FAQ</h2>
            <p className="text-gray-600 text-center">Find answers to frequently asked questions about the platform.</p>
          </div>
        </Link>
        <Link href="/tests">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow cursor-pointer group">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-clipboard-check text-3xl text-blue-600 group-hover:text-blue-800"></i>
            </div>
            <h2 className="text-xl font-bold text-blue-700 mb-2">Tests</h2>
            <p className="text-gray-600 text-center">Take skill tests to evaluate and improve your communication abilities.</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
