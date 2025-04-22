// ToastNotification.jsx
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastNotification = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          maxWidth: '500px',
          padding: '12px',
          borderRadius: '8px',
        },
      }}
    />
  );
};

// Toast utility functions
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: '#22c55e',
      color: '#fff',
    },
  });
};

export const showErrorToast = (message, details = null) => {
  toast.error(`${message}${details ? `\n${details}` : ''}`, {
    duration: 5000,
   
  });
};

export const showInfoToast = (message) => {
  toast(message, {
    duration: 3000,
    
  });
};

export const showWarningToast = (message) => {
  toast(message, {
    duration: 3000,
    
  });
};




export const confirmToast = (message, onConfirm, onCancel = () => {}) => {
  toast.custom((t) => (
    <div
      className={`bg-white shadow-md p-4 rounded-lg w-[300px] border border-gray-300 ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <p className="text-gray-800 mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onCancel();
          }}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  ));
};


export default ToastNotification;