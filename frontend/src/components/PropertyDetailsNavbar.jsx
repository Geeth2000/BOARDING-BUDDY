import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Home } from "lucide-react";

/**
 * Property Details Navbar Component
 * Secondary navbar for property details page
 * Matches main website navbar style
 */
const PropertyDetailsNavbar = ({
  onSave,
  onShare,
  isSaved = false,
  showLogo = true,
}) => {
  return (
    <div className="border-b border-gray-100 bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Left - Back Button */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            {showLogo && (
              <>
                <Link
                  to="/"
                  className="hidden flex-shrink-0 items-center gap-2 sm:flex"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 shadow-sm shadow-blue-600/20">
                    <Home className="h-4 w-4 text-white" />
                  </div>
                </Link>
                <div className="hidden h-6 w-px flex-shrink-0 bg-gray-200 sm:block" />
              </>
            )}
            <Link
              to="/properties"
              className="group flex min-w-0 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-blue-600 sm:gap-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0 transition-transform group-hover:-translate-x-0.5" />
              <span className="truncate">Back to Listings</span>
            </Link>
          </div>

          {/* Right - Action Buttons */}
          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            {/* Save Button */}
            <button
              onClick={onSave}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all sm:gap-2 sm:px-3 ${
                isSaved
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
              aria-label={isSaved ? "Remove from saved" : "Save property"}
            >
              <Heart
                className={`h-4 w-4 flex-shrink-0 ${isSaved ? "fill-red-500" : ""}`}
              />
              <span className="hidden xs:inline sm:inline">
                {isSaved ? "Saved" : "Save"}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={onShare}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-blue-600 sm:gap-2 sm:px-3"
              aria-label="Share property"
            >
              <Share2 className="h-4 w-4 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">Share</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PropertyDetailsNavbar;
