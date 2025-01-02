import { Link, useLocation } from "react-router-dom";
import { useDataContext } from "../../DataContext";
import { useEffect } from "react";

const TopNavbar = () => {
  const { currentTab, setCurrentTab } = useDataContext();
  const location = useLocation();

  const tabs = [
    {
      path: "/",
      label: "Reaction Test",
    },
    {
      path: "/video",
      label: "Video Recorder",
    },
    {
      path: "/profile",
      label: "Github Profile",
    },
  ];

  useEffect(() => {
    if (location?.pathname) {
      setCurrentTab(location.pathname);
    }
  }, [location?.pathname]);

  return (
    <div className="z-100">
      <nav className="flex items-center justify-between bg-gray-800 p-4 fixed top-0 left-0 right-0 z-10 rounded-full m-4">
        <div className="flex items-center space-x-4 overflow-x-scroll md:overflow-x-hidden">
          {tabs?.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-full text-sm min-w-max ${
                currentTab === path
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        {/* Current Tab Image Context */}
        <div className="hidden md:flex items-center space-x-4">
          {location.pathname === "/profile" ? (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
              className="w-10 h-10 rounded-full"
            />
          ) : location.pathname === "/video" ? (
            <img
              src="https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <img
              src="https://png.pngtree.com/png-vector/20221201/ourmid/pngtree-lightning-electric-icon-png-image_6486818.png"
              className="w-10 h-10 rounded-full"
            />
          )}
        </div>
      </nav>
      {/* Current Tab Context */}
      <div className="flex justify-center items-center fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 p-4 rounded-full m-4 cursor-pointer hover:bg-blue-500 z-40">
        <span className="text-white text-sm font-bold min-w-max">
          {location.pathname === "/profile"
            ? "My Github Profile"
            : location.pathname === "/video"
            ? "Record Videos"
            : "Test Your Reaction"}
        </span>
      </div>
    </div>
  );
};

export default TopNavbar;
