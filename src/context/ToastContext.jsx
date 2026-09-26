import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastIcons = {
    success: 'ph ph-check-fat text-emerald-400',
    error: 'ph-bold ph-x text-rose-400',
    warning: 'ph ph-warning text-amber-400',
    info: 'ph ph-info text-blue-400',
  };

  const toastBorderColors = {
    success: 'border-emerald-500 text-emerald-200',
    error: 'border-rose-500 text-rose-200',
    warning: 'border-amber-500 text-amber-200',
    info: 'border-blue-500 text-blue-200',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        id="toast-container"
        className="fixed w-80 max-w-[calc(100vw-2rem)] bottom-4 right-4 pointer-events-none z-50 flex flex-col-reverse gap-2 overflow-hidden"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`w-full bg-slate-900/95 backdrop-blur-md flex p-4 gap-3 rounded-xl border shadow-xl items-center pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              toastBorderColors[toast.type] || toastBorderColors.info
            }`}
          >
            <i className={`${toastIcons[toast.type] || toastIcons.info} text-2xl shrink-0`}></i>
            <span className="text-sm font-medium text-slate-100 flex-1">
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
