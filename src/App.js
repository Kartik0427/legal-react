import { useState } from "react";
import './App.css'; // <-- Import the CSS file

// Import your other components and libraries
import Header from "./components/Header";
import Hero from "./components/Hero";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";
import { auth } from "./lib/firebase";
import { signOut } from "firebase/auth";

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    // Use the class name defined in your CSS file
    <div className="app-container">
      <Header
        user={user}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />
      <Hero />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}