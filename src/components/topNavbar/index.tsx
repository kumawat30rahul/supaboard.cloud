import { Link, useLocation } from "react-router-dom";

const TopNavbar = () => {
  const tabs = [
    { path: "/", label: "Reaction Test", component: null },
    { path: "/video", label: "Video Recorder", component: null },
    { path: "/profile", label: "Github Profile", component: null },
  ];
  const location = useLocation();
  return (
    <nav className="flex space-x-4 bg-[#24252a] p-4">
      {tabs?.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={`px-4 py-2 rounded-full text-sm ${
            location.pathname === path
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-200"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default TopNavbar;
