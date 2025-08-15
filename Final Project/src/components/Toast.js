// Toast notification component
import React from 'react';

function Toast({ message, type }) {
  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        {message}
      </div>
    </div>
  );
}

export default Toast;
