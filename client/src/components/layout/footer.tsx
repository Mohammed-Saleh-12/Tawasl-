import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function Footer() {
  const { isLoggedIn, logout } = useAuth();
  
  return (
    <footer className="bg-gradient-to-r from-blue-100 via-white to-blue-100 border-t border-gray-200 py-8 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-gray-600 text-base mb-2 md:mb-0 font-semibold">
          <span className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
            <i className="fas fa-comments text-white text-lg"></i>
          </span>
          <span className="font-bold text-blue-700 text-xl">Tawasl</span>
          <span className="hidden md:inline text-gray-400 font-normal">|</span>
          <span className="text-gray-400 font-normal">&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden md:inline">Admin Access:</span>
              <Button asChild className="btn-primary btn-enhanced">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600 font-medium">Admin Logged In</span>
              <Button
                onClick={logout}
                className="btn-outline btn-enhanced"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
