import { Button } from "./ui/button";
import UserMenu from "./UserMenu";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  onAuthClick: () => void;
  onSignOut: () => void;
}

export default function MobileMenu({ isOpen, user, onAuthClick, onSignOut }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
      <div className="flex flex-col space-y-4 mt-4">
        <div className="flex flex-col space-y-4">
          <a href="#home" className="text-gray-700 hover:text-gray-900 font-medium">Home</a>
          <a href="#about us" className="text-gray-700 hover:text-gray-900 font-medium">About Us</a>
          <a href="#contact us" className="text-gray-700 hover:text-gray-900 font-medium">Contact Us</a>
        </div>
        {user ? (
          <UserMenu user={user} onSignOut={onSignOut} />
        ) : (
          <Button
            onClick={onAuthClick}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full w-fit"
          >
            Log In/Sign Up
          </Button>
        )}
      </div>
    </div>
  );
}

