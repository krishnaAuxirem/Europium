import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import type { Toast } from "@/types";

interface Props {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={18} className="text-emerald" />,
  error: <AlertCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-royal" />,
  warning: <AlertTriangle size={18} className="text-gold" />,
};

const borderColors = {
  success: "border-l-emerald",
  error: "border-l-red-500",
  info: "border-l-royal",
  warning: "border-l-gold",
};

export default function ToastContainer({ toasts, removeToast }: Props) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-4 bg-white rounded-xl shadow-xl border-l-4 ${borderColors[toast.type]}
                      min-w-[280px] max-w-[420px] animate-slide-in`}
        >
          {icons[toast.type]}
          <p className="text-sm font-medium text-navy flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-navy/40 hover:text-navy transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
