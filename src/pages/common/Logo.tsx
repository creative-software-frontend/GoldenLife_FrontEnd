import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Link to="/">
        <img 
          src="/image/logo/logo.jpg" 
          alt="Golden Life Logo" 
          className="h-12 w-auto object-contain cursor-pointer" 
        />
      </Link>
    </div>
  );
}