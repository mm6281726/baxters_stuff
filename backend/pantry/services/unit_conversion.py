from decimal import Decimal
from typing import Dict, Optional, Tuple

from measurement.services.unit_conversion import convert_units as measurement_convert_units
from ..models import PantryItem
from ingredient.models import Ingredient

class PantryUnitConversionService:
    """
    Service for handling unit conversions in the pantry
    """

    @staticmethod
    def convert_pantry_item_units(pantry_item_id: int, to_unit: str) -> Dict:
        """
        Convert a pantry item's quantity to a different unit

        Args:
            pantry_item_id: The ID of the pantry item
            to_unit: The unit to convert to

        Returns:
            Dictionary with the converted pantry item data
        """
        pantry_item = PantryItem.objects.get(id=pantry_item_id)

        # If the pantry item doesn't have a quantity or unit, we can't convert
        if pantry_item.quantity is None or not pantry_item.unit:
            raise ValueError("Pantry item doesn't have a quantity or unit to convert")

        # If the units are the same, no conversion needed
        if pantry_item.unit == to_unit:
            return {
                "id": pantry_item.id,
                "quantity": float(pantry_item.quantity),
                "unit": pantry_item.unit,
                "converted": False
            }

        # Convert the quantity
        try:
            converted_quantity = measurement_convert_units(
                pantry_item.quantity,
                pantry_item.unit,
                to_unit,
                pantry_item.ingredient.name
            )

            # Update the pantry item
            pantry_item.quantity = converted_quantity
            pantry_item.unit = to_unit
            pantry_item.save()

            return {
                "id": pantry_item.id,
                "quantity": float(converted_quantity),
                "unit": to_unit,
                "converted": True
            }
        except Exception as e:
            raise ValueError(f"Failed to convert units: {str(e)}")

    @staticmethod
    def convert_grocery_to_pantry(grocery_item_id: int, user_id: int, to_unit: Optional[str] = None) -> Dict:
        """
        Convert a grocery list item to a pantry item with optional unit conversion

        Args:
            grocery_item_id: The ID of the grocery list item
            user_id: The ID of the user
            to_unit: Optional unit to convert to

        Returns:
            Dictionary with the created/updated pantry item data
        """
        from grocery_list.models import GroceryListItem

        grocery_item = GroceryListItem.objects.get(id=grocery_item_id)

        # Check if this ingredient already exists in the user's pantry
        existing_pantry_item = PantryItem.objects.filter(
            user_id=user_id,
            ingredient=grocery_item.ingredient
        ).first()

        if existing_pantry_item:
            # If the item exists with the same unit, just add quantities
            if existing_pantry_item.unit == grocery_item.unit:
                existing_pantry_item.quantity += grocery_item.quantity
                existing_pantry_item.save()
                return {
                    "id": existing_pantry_item.id,
                    "quantity": float(existing_pantry_item.quantity),
                    "unit": existing_pantry_item.unit,
                    "stock_level": existing_pantry_item.stock_level,
                    "converted": False
                }
            # If to_unit is specified, use that as the target unit
            elif to_unit:
            else:
                # Different units - try to convert
                try:
                    # Convert grocery item to pantry item's unit
                    target_unit = to_unit or existing_pantry_item.unit
                    converted_quantity = measurement_convert_units(
                        grocery_item.quantity,
                        grocery_item.unit,
                        target_unit,
                        grocery_item.ingredient.name
                    )

                    # Update the pantry item
                    existing_pantry_item.quantity += converted_quantity
                    existing_pantry_item.unit = target_unit
                    existing_pantry_item.save()

                    return {
                        "id": existing_pantry_item.id,
                        "quantity": float(existing_pantry_item.quantity),
                        "unit": target_unit,
                        "stock_level": existing_pantry_item.stock_level,
                        "converted": True
                    }
                except Exception as e:
                    # If conversion fails, create a new item with the original unit
                    new_item = PantryItem.objects.create(
                        user_id=user_id,
                        ingredient=grocery_item.ingredient,
                        quantity=grocery_item.quantity,
                        unit=grocery_item.unit,
                        stock_level='high',  # New items start at high stock
                        notes=f"Added from grocery list: {grocery_item.grocery_list.title}"
                    )

                    return {
                        "id": new_item.id,
                        "quantity": float(new_item.quantity),
                        "unit": new_item.unit,
                        "stock_level": new_item.stock_level,
                        "converted": False
                    }
        else:
            # Create a new pantry item
            new_item = PantryItem.objects.create(
                user_id=user_id,
                ingredient=grocery_item.ingredient,
                quantity=grocery_item.quantity,
                unit=grocery_item.unit,
                stock_level='high',  # New items start at high stock
                notes=f"Added from grocery list: {grocery_item.grocery_list.title}"
            )

            return {
                "id": new_item.id,
                "quantity": float(new_item.quantity),
                "unit": new_item.unit,
                "stock_level": new_item.stock_level,
                "converted": False
            }
