import React, { useState } from 'react';
import { FormGroup, Label, Input, Button, Alert, Spinner } from 'reactstrap';
import axios from 'axios';

const UnitConverter = ({ 
  ingredientId, 
  initialQuantity, 
  initialUnit,
  onConvert
}) => {
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [fromUnit, setFromUnit] = useState(initialUnit || '');
  const [toUnit, setToUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
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
  
  // Flatten all units for the dropdowns
  const allUnits = [
    ...commonUnits.weight,
    ...commonUnits.volume,
    ...commonUnits.count
  ];
  
  const handleConvert = async () => {
    if (!fromUnit || !toUnit) {
      setError('Please select both units');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const response = await axios.post('/api/measurement/convert/', {
        quantity: parseFloat(quantity),
        from_unit: fromUnit,
        to_unit: toUnit,
        ingredient_id: ingredientId
      });
      
      setResult(response.data);
      
      if (onConvert) {
        onConvert(response.data.converted_quantity, toUnit);
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.response?.data?.error || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="unit-converter p-3 border rounded mb-3">
      <h5>Convert Units</h5>
      
      {error && <Alert color="danger">{error}</Alert>}
      {result && (
        <Alert color="success">
          {quantity} {fromUnit} = {result.converted_quantity.toFixed(2)} {toUnit}
          {!result.is_exact && <div><small>(Approximate conversion)</small></div>}
        </Alert>
      )}
      
      <div className="row">
        <div className="col-md-4">
          <FormGroup>
            <Label for="quantity">Quantity</Label>
            <Input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              min="0.01"
              step="0.01"
            />
          </FormGroup>
        </div>
        
        <div className="col-md-4">
          <FormGroup>
            <Label for="from-unit">From Unit</Label>
            <Input
              type="select"
              id="from-unit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              <option value="">Select unit</option>
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
              <optgroup label="Count">
                {commonUnits.count.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </optgroup>
            </Input>
          </FormGroup>
        </div>
        
        <div className="col-md-4">
          <FormGroup>
            <Label for="to-unit">To Unit</Label>
            <Input
              type="select"
              id="to-unit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              <option value="">Select unit</option>
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
              <optgroup label="Count">
                {commonUnits.count.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </optgroup>
            </Input>
          </FormGroup>
        </div>
      </div>
      
      <Button 
        color="primary" 
        onClick={handleConvert}
        disabled={loading}
      >
        {loading ? <Spinner size="sm" /> : 'Convert'}
      </Button>
    </div>
  );
};

export default UnitConverter;
