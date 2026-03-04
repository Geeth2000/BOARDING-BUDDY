import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

/**
 * Public Layout Component
 * Wraps public pages with the public navbar
 */
const PublicLayout = () => {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
