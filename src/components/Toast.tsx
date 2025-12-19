'use client';

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

// ============================================================================
// 타입 정의
// ============================================================================

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

// ============================================================================
// Context
// ============================================================================

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// ============================================================================
// Toast Item 컴포넌트
// ============================================================================

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 200);
  }, [onClose, toast.id]);

  useEffect(() => {
    // 진입 애니메이션
    const enterTimer = setTimeout(() => setIsVisible(true), 10);

    // 자동 닫기
    const duration = toast.duration ?? 3000;
    const closeTimer = setTimeout(handleClose, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimer);
    };
  }, [toast.duration, handleClose]);

  const config = {
    success: {
      bg: 'bg-emerald-500',
      icon: <Check className="w-4 h-4" />,
    },
    error: {
      bg: 'bg-red-500',
      icon: <X className="w-4 h-4" />,
    },
    warning: {
      bg: 'bg-amber-500',
      icon: <AlertCircle className="w-4 h-4" />,
    },
    info: {
      bg: 'bg-blue-500',
      icon: <Info className="w-4 h-4" />,
    },
  }[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white transition-all duration-200 ${config.bg} ${
        isVisible && !isExiting
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ============================================================================
// Toast Provider
// ============================================================================

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 max-w-sm w-full px-4">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// 전역 toast 함수는 미사용으로 제거됨
// Provider 기반 useToast() hook 사용 권장
