import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const DeleteConfirmationModal = ({ isOpen, toggle, onConfirm, itemName, itemType }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} className="bg-danger text-white">
        Confirm Delete
      </ModalHeader>
      <ModalBody>
        <p>Are you sure you want to delete the {itemType} <strong>{itemName}</strong>?</p>
        <p>This action cannot be undone.</p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="danger"
          onClick={() => {
            onConfirm();
            toggle();
          }}
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteConfirmationModal;
