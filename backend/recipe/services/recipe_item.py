import logging
from typing import Dict, List

from ..models import RecipeItem
from ..serializers import RecipeItemSerializer
from grocery_list.models import GroceryListItem

logger = logging.getLogger(__name__)

class RecipeItemService:

    @staticmethod
    def list(recipe_id) -> Dict:
        """
        List all items for a recipe
        """
        items = RecipeItem.objects.filter(recipe_id=recipe_id).order_by('ingredient__name')
        serializer = RecipeItemSerializer(items, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        """
        Get a specific recipe item by ID
        """
        item = RecipeItemService.__get(id=id)
        serializer = RecipeItemSerializer(item)
        return serializer.data

    @staticmethod
    def create(validated_data) -> Dict:
        """
        Create a new recipe item
        """
        serializer = RecipeItemSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def update(id, validated_data) -> Dict:
        """
        Update an existing recipe item
        """
        item = RecipeItemService.__get(id=id)
        serializer = RecipeItemSerializer(instance=item, data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def delete(id) -> Dict:
        """
        Delete a recipe item
        """
        item = RecipeItemService.__get(id=id)
        item.delete()
        return {"status_code": 200}

    @staticmethod
    def add_to_grocery_list(recipe_id, grocery_list_id) -> Dict:
        """
        Add all items from a recipe to a grocery list
        """
        try:
            # Get all items from the recipe
            recipe_items = RecipeItem.objects.filter(recipe_id=recipe_id)
            
            added_items = []
            
            # Add each recipe item to the grocery list
            for item in recipe_items:
                # Check if the item already exists in the grocery list
                existing_item = GroceryListItem.objects.filter(
                    grocery_list_id=grocery_list_id,
                    ingredient_id=item.ingredient_id
                ).first()
                
                if existing_item:
                    # If the item exists, update the quantity
                    existing_item.quantity += item.quantity
                    existing_item.save()
                    added_items.append(existing_item)
                else:
                    # If the item doesn't exist, create a new grocery list item
                    grocery_item = GroceryListItem.objects.create(
                        grocery_list_id=grocery_list_id,
                        ingredient_id=item.ingredient_id,
                        quantity=item.quantity,
                        unit=item.unit,
                        notes=item.notes,
                        purchased=False
                    )
                    added_items.append(grocery_item)
            
            # Return the added items
            return {
                "status": "success",
                "message": f"Added {len(added_items)} items to grocery list",
                "count": len(added_items)
            }
        
        except Exception as e:
            logger.error(f"Error adding recipe items to grocery list: {str(e)}")
            return {
                "status": "error",
                "message": f"Error adding recipe items to grocery list: {str(e)}"
            }

    @staticmethod
    def __get(id=id):
        """
        Helper method to get a recipe item by ID
        """
        return RecipeItem.objects.filter(id=id).first()
