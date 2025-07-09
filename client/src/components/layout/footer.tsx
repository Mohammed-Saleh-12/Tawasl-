import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('platform_logged_in') === 'true';
  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-gray-500 text-sm mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} Tawasl. All rights reserved.
        </div>
        <div>
          {isLoggedIn ? (
            <Button
              onClick={() => {
                localStorage.removeItem('platform_logged_in');
                window.location.reload();
              }}
              className="btn-outline"
            >
              Logout
            </Button>
          ) : (
            <Button asChild className="btn-outline">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
