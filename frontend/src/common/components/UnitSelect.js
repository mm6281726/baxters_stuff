import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

const UnitSelect = ({ 
  value, 
  onChange, 
  label = "Unit",
  required = false 
}) => {
  // Common units grouped by type
  const commonUnits = {
    weight: [
      { value: 'g', label: 'Grams (g)' },
      { value: 'kg', label: 'Kilograms (kg)' },
      { value: 'oz', label: 'Ounces (oz)' },
      { value: 'lb', label: 'Pounds (lb)' }
    ],
    volume: [
      { value: 'ml', label: 'Milliliters (ml)' },
      { value: 'l', label: 'Liters (l)' },
      { value: 'tsp', label: 'Teaspoons (tsp)' },
      { value: 'tbsp', label: 'Tablespoons (tbsp)' },
      { value: 'cup', label: 'Cups' },
      { value: 'pint', label: 'Pints' },
      { value: 'quart', label: 'Quarts' },
      { value: 'gallon', label: 'Gallons' }
    ],
    count: [
      { value: '', label: 'Count (no unit)' }
    ]
  };
  
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  
  return (
    <FormGroup className="mb-3">
      <Label for="unit-select" className="fw-bold">
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      <Input
        type="select"
        id="unit-select"
        value={value || ""}
        onChange={handleChange}
        className="form-control-lg"
      >
        <option value="">No Unit</option>
        <optgroup label="Weight">
          {commonUnits.weight.map(unit => (
            <option key={unit.value} value={unit.value}>{unit.label}</option>
          ))}
        </optgroup>
        <optgroup label="Volume">
          {commonUnits.volume.map(unit => (
            <option key={unit.value} value={unit.value}>{unit.label}</option>
          ))}
        </optgroup>
      </Input>
    </FormGroup>
  );
};

export default UnitSelect;
