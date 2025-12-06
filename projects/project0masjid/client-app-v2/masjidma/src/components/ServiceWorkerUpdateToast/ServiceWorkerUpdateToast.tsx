import React from 'react';
import { Toast, Button } from 'react-bootstrap';

interface ServiceWorkerUpdateToastProps {
  show: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

const ServiceWorkerUpdateToast: React.FC<ServiceWorkerUpdateToastProps> = ({
  show,
  onUpdate,
  onDismiss
}) => {
  return (
    <Toast
      show={show}
      onClose={onDismiss}
      delay={10000}
      autohide
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        minWidth: '300px'
      }}
    >
      <Toast.Header>
        <strong className="mr-auto">App Update Available</strong>
      </Toast.Header>
      <Toast.Body>
        <p>A new version is available! Update now for the latest features.</p>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onUpdate}
          >
            Update Now
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onDismiss}
          >
            Later
          </Button>
        </div>
      </Toast.Body>
    </Toast>
  );
};

export default ServiceWorkerUpdateToast;
