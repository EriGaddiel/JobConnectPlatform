
import { Link } from "react-router-dom";

export function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 bg-jobconnect-primary rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">J</span>
      </div>
      <span className="font-bold text-xl text-gray-900 dark:text-white">JobConnect</span>
    </Link>
  );
}
