import React, { useEffect, useRef } from "react";
import { Toast } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useToast } from "../context/ToastContext"; // Adjust the path as necessary

const ToastMessage = () => {
  const { toast, hideToast } = useToast();
  const { show, message, variant } = toast;
  const toastRef = useRef(null);
  const toastInstance = useRef(null);

  // Initialize toast when component mounts
  useEffect(() => {
    if (toastRef.current) {
      toastInstance.current = new Toast(toastRef.current, {
        autohide: false,
        delay: 3000,
      });
    }

    return () => {
      // Ensure we cleanup on unmount
      if (toastInstance.current && toastInstance.current.dispose) {
        try {
          toastInstance.current.dispose();
        } catch (e) {
          console.log("Toast cleanup error:", e);
        }
      }
    };
  }, []);

  // Control toast visibility based on show prop
  useEffect(() => {
    if (!toastInstance.current) return;

    if (show) {
      toastInstance.current.show();
    } else {
      try {
        toastInstance.current.hide();
      } catch (e) {
        console.log("Error hiding toast:", e);
      }
    }
  }, [show]);

  // Add event listeners for toast events
  useEffect(() => {
    const element = toastRef.current;
    if (!element) return;

    const handleHidden = () => {
      hideToast();
    };

    element.addEventListener("hidden.bs.toast", handleHidden);

    return () => {
      element.removeEventListener("hidden.bs.toast", handleHidden);
    };
  }, [hideToast]);

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1090 }}
    >
      <div
        ref={toastRef}
        className={`toast align-items-center text-white bg-${variant} border-0`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;
