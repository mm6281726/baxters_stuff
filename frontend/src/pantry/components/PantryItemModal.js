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
  Row,
  Col,
  Alert,
  FormText
} from "reactstrap";
import IngredientSelect from "../../groceryList/components/IngredientSelect";
import UnitConverter from "../../common/components/UnitConverter";
import UnitSelect from "../../common/components/UnitSelect";
import "../pages/List.css";

const PantryItemModal = ({ activeItem: initialItem, toggle, onSave }) => {
  const [activeItem, setActiveItem] = useState(initialItem);
  const [error, setError] = useState("");
  const [showExactQuantity, setShowExactQuantity] = useState(false);

  useEffect(() => {
    setActiveItem(initialItem);
    // If quantity and unit are set, show the exact quantity section
    setShowExactQuantity(initialItem.quantity != null && initialItem.quantity !== "");
  }, [initialItem]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    const updatedItem = { ...activeItem };

    if (name === "quantity") {
      // If no unit is assigned, convert quantity to integer
      if (!updatedItem.unit) {
        value = parseInt(value) || 1; // Default to 1 if parsing fails
      } else {
        // Otherwise, allow decimal values
        value = parseFloat(value) || 1; // Default to 1 if parsing fails
      }
    } else if (name === "unit") {
      // If unit is being cleared and we have a decimal quantity, convert to integer
      if (!value && updatedItem.quantity && !Number.isInteger(updatedItem.quantity)) {
        updatedItem.quantity = Math.round(updatedItem.quantity);
      }
    }

    updatedItem[name] = value;
    setActiveItem(updatedItem);
  };

  const handleIngredientChange = (selectedIngredient) => {
    if (selectedIngredient) {
      setActiveItem({
        ...activeItem,
        ingredient: selectedIngredient.value,
        ingredient_details: { id: selectedIngredient.value, name: selectedIngredient.label }
      });
      setError(""); // Clear any error when an ingredient is selected
    } else {
      setActiveItem({
        ...activeItem,
        ingredient: null,
        ingredient_details: null
      });
    }
  };

  const handleSubmit = () => {
    if (!activeItem.ingredient) {
      setError("Please select an ingredient");
      return;
    }

    // If exact quantity is not being shown, clear those fields
    const itemToSave = { ...activeItem };
    if (!showExactQuantity) {
      itemToSave.quantity = null;
      itemToSave.unit = null;
    }

    onSave(itemToSave);
  };

  // Stock level colors for visual indication
  const stockLevelColors = {
    high: 'success',
    medium: 'info',
    low: 'warning',
    out: 'danger'
  };

  // Stock level icons
  const stockLevelIcons = {
    high: 'bi bi-battery-full',
    medium: 'bi bi-battery-half',
    low: 'bi bi-battery-low',
    out: 'bi bi-battery'
  };


  return (
    <Modal isOpen={true} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="bg-light">
        <span className="fw-bold">{activeItem.id ? 'Edit' : 'Add'} Pantry Item</span>
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form>
          <FormGroup className="mb-4">
            <Label for="item-ingredient" className="fw-bold">Ingredient *</Label>
            <IngredientSelect
              selectedIngredient={activeItem.ingredient_details ? {
                value: activeItem.ingredient_details.id,
                label: activeItem.ingredient_details.name
              } : null}
              onChange={handleIngredientChange}
            />
          </FormGroup>

          <FormGroup className="mb-4">
            <Label className="fw-bold">Stock Level</Label>
            <div className="d-flex justify-content-between mb-2">
              {['high', 'medium', 'low', 'out'].map(level => (
                <div key={level} className="text-center" style={{ flex: '1' }}>
                  <Button
                    color={activeItem.stock_level === level ? stockLevelColors[level] : 'outline-secondary'}
                    className="rounded-circle p-3 mb-2 d-flex align-items-center justify-content-center mx-auto"
                    onClick={() => setActiveItem({ ...activeItem, stock_level: level })}
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i className={stockLevelIcons[level] + " fs-4"}></i>
                  </Button>
                  <div className="small text-capitalize">{level}</div>
                </div>
              ))}
            </div>
          </FormGroup>

          <FormGroup className="mb-3">
            <div className="form-check form-switch">
              <Input
                type="checkbox"
                className="form-check-input"
                id="exact-quantity-switch"
                checked={showExactQuantity}
                onChange={() => setShowExactQuantity(!showExactQuantity)}
              />
              <Label className="form-check-label" for="exact-quantity-switch">
                Track exact quantity
              </Label>
            </div>
            <FormText color="muted">
              Enable this if you want to track the precise amount in your pantry.
            </FormText>
          </FormGroup>

          {showExactQuantity && (
            <>
              <Row>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="item-quantity" className="fw-bold">Quantity</Label>
                    <Input
                      type="number"
                      id="item-quantity"
                      name="quantity"
                      value={activeItem.quantity || ""}
                      onChange={handleChange}
                      min="0.01"
                      step={activeItem.unit ? "0.01" : "1"}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <UnitSelect
                    value={activeItem.unit || ""}
                    onChange={(value) => setActiveItem({ ...activeItem, unit: value })}
                    label="Unit"
                  />
                </Col>
              </Row>

              {activeItem.ingredient && activeItem.unit && (
                <UnitConverter
                  ingredientId={activeItem.ingredient}
                  initialQuantity={activeItem.quantity}
                  initialUnit={activeItem.unit}
                  onConvert={(convertedQuantity, convertedUnit) => {
                    setActiveItem({
                      ...activeItem,
                      quantity: convertedQuantity,
                      unit: convertedUnit
                    });
                  }}
                />
              )}
            </>
          )}
          <FormGroup className="mb-3">
            <Label for="item-notes" className="fw-bold">Notes</Label>
            <Input
              type="textarea"
              id="item-notes"
              name="notes"
              value={activeItem.notes || ""}
              onChange={handleChange}
              placeholder="Add any notes about this item"
              rows="3"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="bg-light">
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="success"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PantryItemModal;
