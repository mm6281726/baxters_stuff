from decimal import Decimal
from typing import Dict, Optional, Union

# Define unit conversion constants
WEIGHT_CONVERSIONS = {
    'g': 1,           # base unit for weight
    'kg': 1000,       # 1 kg = 1000 g
    'oz': 28.35,      # 1 oz = 28.35 g
    'lb': 453.59,     # 1 lb = 453.59 g
}

VOLUME_CONVERSIONS = {
    'ml': 1,          # base unit for volume
    'l': 1000,        # 1 l = 1000 ml
    'tsp': 4.93,      # 1 tsp = 4.93 ml
    'tbsp': 14.79,    # 1 tbsp = 14.79 ml
    'cup': 236.59,    # 1 cup = 236.59 ml
    'pint': 473.18,   # 1 pint = 473.18 ml
    'quart': 946.35,  # 1 quart = 946.35 ml
    'gallon': 3785.41 # 1 gallon = 3785.41 ml
}

# Common ingredient densities (g/ml)
INGREDIENT_DENSITIES = {
    'water': 1.0,
    'milk': 1.03,
    'flour': 0.53,
    'sugar': 0.85,
    'salt': 1.2,
    'oil': 0.92,
    'butter': 0.96,
    'honey': 1.42,
    # Add more common ingredients
}

def get_unit_type(unit: str) -> str:
    """Determine if a unit is for weight, volume, or count"""
    if not unit:
        return 'count'
    unit = unit.lower()
    if unit in WEIGHT_CONVERSIONS:
        return 'weight'
    elif unit in VOLUME_CONVERSIONS:
        return 'volume'
    else:
        return 'count'

def convert_units(
    quantity: Union[float, Decimal], 
    from_unit: str, 
    to_unit: str, 
    ingredient_name: Optional[str] = None
) -> Decimal:
    """
    Convert a quantity from one unit to another
    
    Args:
        quantity: The quantity to convert
        from_unit: The unit to convert from
        to_unit: The unit to convert to
        ingredient_name: Optional ingredient name for density-based conversions
        
    Returns:
        The converted quantity as a Decimal
    """
    # Handle null or empty units
    if not from_unit and not to_unit:
        return Decimal(str(quantity))
    if not from_unit or not to_unit:
        raise ValueError("Cannot convert between a unit and no unit")
    
    # Normalize units to lowercase
    from_unit = from_unit.lower()
    to_unit = to_unit.lower()
    
    # If units are the same, no conversion needed
    if from_unit == to_unit:
        return Decimal(str(quantity))
    
    # Get unit types
    from_type = get_unit_type(from_unit)
    to_type = get_unit_type(to_unit)
    
    # Convert within the same type
    if from_type == to_type:
        if from_type == 'weight':
            # Convert to base unit (g) then to target unit
            base_quantity = Decimal(str(quantity)) * Decimal(str(WEIGHT_CONVERSIONS[from_unit]))
            return base_quantity / Decimal(str(WEIGHT_CONVERSIONS[to_unit]))
        elif from_type == 'volume':
            # Convert to base unit (ml) then to target unit
            base_quantity = Decimal(str(quantity)) * Decimal(str(VOLUME_CONVERSIONS[from_unit]))
            return base_quantity / Decimal(str(VOLUME_CONVERSIONS[to_unit]))
        else:
            # Count units can't be converted between different units
            raise ValueError(f"Cannot convert between different count units: {from_unit} to {to_unit}")
    
    # Convert between different types (weight <-> volume)
    if from_type in ['weight', 'volume'] and to_type in ['weight', 'volume']:
        if not ingredient_name:
            raise ValueError("Ingredient name required for weight-volume conversions")
        
        # Get ingredient density
        density = get_ingredient_density(ingredient_name)
        
        if from_type == 'weight' and to_type == 'volume':
            # weight to volume: volume = weight / density
            # Convert weight to grams first
            weight_in_g = Decimal(str(quantity)) * Decimal(str(WEIGHT_CONVERSIONS[from_unit]))
            # Convert grams to ml using density
            volume_in_ml = weight_in_g / Decimal(str(density))
            # Convert ml to target volume unit
            return volume_in_ml / Decimal(str(VOLUME_CONVERSIONS[to_unit]))
        else:  # volume to weight
            # volume to weight: weight = volume * density
            # Convert volume to ml first
            volume_in_ml = Decimal(str(quantity)) * Decimal(str(VOLUME_CONVERSIONS[from_unit]))
            # Convert ml to grams using density
            weight_in_g = volume_in_ml * Decimal(str(density))
            # Convert grams to target weight unit
            return weight_in_g / Decimal(str(WEIGHT_CONVERSIONS[to_unit]))
    
    # Other conversions not supported
    raise ValueError(f"Cannot convert from {from_type} to {to_type}")

def get_ingredient_density(ingredient_name: str) -> float:
    """
    Get the density of an ingredient in g/ml
    
    This function tries to find the density from a lookup table of common ingredients
    """
    # Check the lookup table using the ingredient name
    ingredient_name = ingredient_name.lower()
    for key, density in INGREDIENT_DENSITIES.items():
        if key in ingredient_name:
            return density
    
    # Use category-based defaults based on ingredient name
    if any(word in ingredient_name for word in ['liquid', 'oil', 'sauce', 'beverage', 'water', 'milk', 'juice']):
        return 1.0  # Approximate density of water
    elif any(word in ingredient_name for word in ['flour', 'powder', 'spice', 'sugar', 'salt']):
        return 0.6  # Approximate density of flour
    elif any(word in ingredient_name for word in ['meat', 'protein', 'cheese', 'chicken', 'beef', 'pork']):
        return 1.1  # Approximate density of meat
    
    # Default fallback
    return 0.8  # A middle-ground default
