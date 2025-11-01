// src/components/Sidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  LogOut, 
  GraduationCap, 
  Menu, 
  X,
  Brain
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
      active: location.pathname === "/admin/dashboard",
    },
    {
      icon: Users,
      label: "Manage Students",
      path: "/admin/students",
      active: location.pathname === "/admin/students",
    },
    {
      icon: TrendingUp,
      label: "Performance Summary",
      path: "/admin/performance",
      active: location.pathname === "/admin/performance",
    },
    {
      icon: Brain,
      label: "Placement Prediction",
      path: "/admin/prediction",
      active: location.pathname === "/admin/prediction",
    },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out flex flex-col shadow-2xl`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700/50">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-400">Placement System</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-all hover:scale-110 active:scale-95"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-gray-300" />
          ) : (
            <Menu className="w-5 h-5 text-gray-300" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                item.active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105"
              }`}
            >
              <IconComponent 
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  item.active ? "animate-pulse" : ""
                }`}
              />
              {sidebarOpen && (
                <span className="font-medium text-sm tracking-wide">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white transition-all duration-200 group hover:scale-105"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
          {sidebarOpen && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </button>
      </div>

      {/* Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 text-center">
            © 2024 Placement System
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;