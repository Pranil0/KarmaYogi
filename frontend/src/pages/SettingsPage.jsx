import { NavLink, Outlet } from "react-router-dom";

const SettingsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-1/4 bg-gray-100 border border-gray-200 rounded-lg shadow-md">
        <h3 className="px-6 py-4 text-lg font-semibold border-b border-gray-200 text-gray-800">
          Settings
        </h3>
        <nav className="flex flex-col">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `px-6 py-3 border-l-4 transition-all ${
                isActive
                  ? "border-green-600 bg-white text-green-600 font-semibold"
                  : "border-transparent text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Update Profile
          </NavLink>

          <NavLink
            to="email"
            className={({ isActive }) =>
              `px-6 py-3 border-l-4 transition-all ${
                isActive
                  ? "border-green-600 bg-white text-green-600 font-semibold"
                  : "border-transparent text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Change Email
          </NavLink>

          <NavLink
            to="password"
            className={({ isActive }) =>
              `px-6 py-3 border-l-4 transition-all ${
                isActive
                  ? "border-green-600 bg-white text-green-600 font-semibold"
                  : "border-transparent text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Change Password
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:w-3/4 md:pl-10 mt-6 md:mt-0">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Account Settings</h2>
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsPage;
