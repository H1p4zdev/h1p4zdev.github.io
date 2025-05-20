import { Link, useLocation } from "wouter";

export default function NavBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-lighter z-10">
      <div className="flex justify-around">
        <Link href="/dashboard">
          <a className={`w-1/4 p-4 flex flex-col items-center ${location === "/dashboard" ? "text-primary" : "text-text-secondary"}`}>
            <i className="ri-home-5-line text-2xl"></i>
            <span className="text-xs mt-1 font-medium">Home</span>
          </a>
        </Link>
        <Link href="/tournaments">
          <a className={`w-1/4 p-4 flex flex-col items-center ${location === "/tournaments" ? "text-primary" : "text-text-secondary"}`}>
            <i className="ri-trophy-line text-2xl"></i>
            <span className="text-xs mt-1">Tournaments</span>
          </a>
        </Link>
        <Link href="/notifications">
          <a className={`w-1/4 p-4 flex flex-col items-center ${location === "/notifications" ? "text-primary" : "text-text-secondary"}`}>
            <div className="relative">
              <i className="ri-notification-3-line text-2xl"></i>
              <span className="nav-indicator"></span>
            </div>
            <span className="text-xs mt-1">Notifications</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`w-1/4 p-4 flex flex-col items-center ${location === "/profile" ? "text-primary" : "text-text-secondary"}`}>
            <i className="ri-user-3-line text-2xl"></i>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
