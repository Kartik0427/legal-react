import { useState } from "react";
import { Scale, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Navigation from "./Navigation";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  user: any;
  onAuthClick: () => void;
  onSignOut: () => void;
}

export default function Header({ user, onAuthClick, onSignOut }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 pt-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-black rounded-full p-2">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Legal Port</h1>
              <p className="text-sm text-gray-600">Connect. Consult. Resolve.</p>
            </div>
          </div>
          <div className="hidden md:block">
            <Navigation />
          </div>
          <div className="hidden md:block">
            {user ? (
              <UserMenu user={user} onSignOut={onSignOut} />
            ) : (
              <Button
                onClick={onAuthClick}
                className="rounded-full bg-teal-600 text-white hover:bg-teal-700 px-6 transition-all duration-300 transform hover:scale-105"
              >
                Log In/Sign Up
              </Button>
            )}
          </div>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <MobileMenu isOpen={isMobileMenuOpen} user={user} onAuthClick={onAuthClick} onSignOut={onSignOut} />
      </div>
    </header>
  );
}
