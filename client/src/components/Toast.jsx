import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const dismiss = useCallback((id) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const toast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setItems((current) => [...current, { id, message, type }]);
    window.setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);
  const value = useMemo(() => toast, [toast]);
  const Icon = { success: CheckCircle2, error: CircleAlert, info: Info };
  return <ToastContext.Provider value={value}>{children}<div className="toast-stack" aria-live="polite">{items.map((item) => { const Glyph = Icon[item.type] || Info; return <div className={`toast ${item.type}`} key={item.id}><Glyph size={17} /><span>{item.message}</span><button className="icon-button" onClick={() => dismiss(item.id)} aria-label="Dismiss"><X size={15} /></button></div>; })}</div></ToastContext.Provider>;
}
