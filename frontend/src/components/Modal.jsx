import { useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

/**
 * Modal Component
 * Reusable modal dialog with different variants
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  variant = "default", // default, danger, success, warning, info
  size = "md", // sm, md, lg, xl
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  const variantIcons = {
    danger: <AlertTriangle className="h-6 w-6 text-red-500" />,
    success: <CheckCircle className="h-6 w-6 text-green-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
  };

  const variantColors = {
    danger: "border-red-200 bg-red-50",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    info: "border-blue-200 bg-blue-50",
    default: "border-gray-200 bg-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${sizeClasses[size]} transform rounded-2xl bg-white shadow-2xl transition-all`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between border-b p-4 ${
              variant !== "default" ? variantColors[variant] : "bg-gray-50"
            } rounded-t-2xl`}
          >
            <div className="flex items-center gap-3">
              {variant !== "default" && variantIcons[variant]}
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Confirm Modal Component
 * Specialized modal for confirmations
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) => {
  const buttonVariants = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    info: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    default: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${buttonVariants[variant]}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </>
      }
    >
      <p className="text-gray-600">{message}</p>
    </Modal>
  );
};

export default Modal;
