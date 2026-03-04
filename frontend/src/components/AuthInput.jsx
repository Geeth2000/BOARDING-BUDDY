import { Eye, EyeOff } from "lucide-react";

/**
 * AuthInput Component
 * Reusable input field for authentication forms
 */
const AuthInput = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  autoComplete,
  disabled = false,
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        )}
        <input
          type={
            showPasswordToggle ? (showPassword ? "text" : "password") : type
          }
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 ${
            Icon ? "pl-12" : "pl-4"
          } ${showPasswordToggle ? "pr-12" : "pr-4"}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
