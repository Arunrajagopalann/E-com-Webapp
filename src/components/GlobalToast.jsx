// src/components/GlobalToast.jsx
import React from "react";
import ToastMessage from "./ToastMessage";
import { useToast } from "../context/ToastContext";

const GlobalToast = () => {
  const { toast, hideToast } = useToast();

  return (
    <ToastMessage
      show={toast.show}
      message={toast.message}
      variant={toast.variant}
      onClose={hideToast}
    />
  );
};

export default GlobalToast;
