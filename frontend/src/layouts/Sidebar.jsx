import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { ConfirmModal } from "../components";
import {
  Home,
  Building2,
  CalendarCheck,
  Star,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  User,
  ClipboardList,
  PlusCircle,
} from "lucide-react";

/**
 * Menu configuration by role
 */
const menuConfig = {
  student: [
    { name: "Dashboard", path: "/student/dashboard", icon: Home },
    { name: "Browse Properties", path: "/student/properties", icon: Building2 },
    { name: "My Bookings", path: "/student/bookings", icon: CalendarCheck },
    { name: "My Reviews", path: "/student/reviews", icon: Star },
    { name: "Messages", path: "/student/messages", icon: MessageSquare },
  ],
  landlord: [
    { name: "Dashboard", path: "/landlord/dashboard", icon: Home },
    { name: "Add Property", path: "/landlord/add-property", icon: PlusCircle },
    { name: "My Properties", path: "/landlord/properties", icon: Building2 },
    {
      name: "Booking Requests",
      path: "/landlord/bookings",
      icon: CalendarCheck,
    },
    { name: "Reviews", path: "/landlord/reviews", icon: Star },
    { name: "Messages", path: "/landlord/messages", icon: MessageSquare },
  ],
  admin: [
    { name: "Dashboard", path: "/admin/dashboard", icon: Home },
    { name: "Properties", path: "/admin/properties", icon: Building2 },
    { name: "Bookings", path: "/admin/bookings", icon: ClipboardList },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
  ],
  common: [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ],
};

/**
 * Sidebar Component
 * Responsive sidebar with role-based navigation
 */
const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Get menu items based on user role
  const roleMenu = menuConfig[user?.role] || [];
  const commonMenu = menuConfig.common;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-slate-800 text-white transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold">Boarding Buddy</span>
          </div>
        )}
        {isCollapsed && <Shield className="mx-auto h-8 w-8 text-blue-400" />}

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-slate-700 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop collapse button */}
        <button
          onClick={onToggleCollapse}
          className="hidden rounded-lg p-2 hover:bg-slate-700 lg:block"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* User info */}
      <div className="border-b border-slate-700 p-4">
        <div
          className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="truncate font-medium">{user?.name}</p>
              <p className="truncate text-sm text-slate-400 capitalize">
                {user?.role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Role-specific menu */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
              Menu
            </p>
          )}
          {roleMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-slate-700" />

        {/* Common menu */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
              Account
            </p>
          )}
          {commonMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout button */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={handleLogoutClick}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition-colors hover:bg-red-600 hover:text-white ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="warning"
        loading={loggingOut}
      />
    </aside>
  );
};

export default Sidebar;
