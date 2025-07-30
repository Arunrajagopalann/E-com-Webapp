import React, { createContext, useState, useContext } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
const [onCloseCallback, setOnCloseCallback] = useState(null);

  const showToast = (message, variant = "success", onClose = null) => {
    setToast({ show: true, message, variant });
    setTimeout(() => {
      setOnCloseCallback(() => {hideToast();onClose();});
    }, 3000);
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
     if (onCloseCallback) {
    onCloseCallback(); // Run callback after toast is hidden
    setOnCloseCallback(null);
  }
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
