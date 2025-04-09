import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const DeleteConfirmationModal = ({ isOpen, toggle, onConfirm, itemName, itemType }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} className="bg-light">
        <span className="fw-bold">Confirm Delete</span>
      </ModalHeader>
      <ModalBody>
        <p>Are you sure you want to delete the {itemType} <strong>{itemName}</strong>?</p>
        <p>This action cannot be undone.</p>
      </ModalBody>
      <ModalFooter className="bg-light">
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="danger" onClick={onConfirm}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteConfirmationModal;
