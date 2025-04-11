import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Alert
} from "reactstrap";
import "../pages/Detail.css";

const RecipeStepModal = ({ activeStep: initialStep, toggle, onSave, onDelete }) => {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveStep(initialStep);
  }, [initialStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'step_number') {
      const numValue = value === '' ? '' : parseInt(value);
      setActiveStep({
        ...activeStep,
        [name]: numValue
      });
    } else {
      setActiveStep({
        ...activeStep,
        [name]: value
      });
    }
  };

  const handleSubmit = () => {
    if (!activeStep.description.trim()) {
      setError("Please enter a description for the step");
      return;
    }
    if (!activeStep.step_number) {
      setError("Please enter a step number");
      return;
    }
    onSave(activeStep);
  };

  return (
    <Modal isOpen={true} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="bg-light">
        <span className="fw-bold">{activeStep.id ? 'Edit' : 'Add'} Recipe Step</span>
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form>
          <FormGroup className="mb-3">
            <Label for="step-number" className="fw-bold">Step Number *</Label>
            <Input
              type="number"
              id="step-number"
              name="step_number"
              value={activeStep.step_number || ""}
              onChange={handleChange}
              min="1"
              className="form-control"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Label for="step-description" className="fw-bold">Description *</Label>
            <Input
              type="textarea"
              id="step-description"
              name="description"
              value={activeStep.description || ""}
              onChange={handleChange}
              placeholder="Enter step instructions"
              rows="5"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="bg-light">
        <div className="d-flex justify-content-between w-100">
          {initialStep.id && (
            <Button color="danger" onClick={() => { onDelete(initialStep); toggle(); }}>
              Delete
            </Button>
          )}
          <div>
            <Button color="secondary" onClick={toggle} className="me-2">
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default RecipeStepModal;
