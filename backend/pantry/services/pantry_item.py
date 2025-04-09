import logging
from typing import Dict, List

from ..models import PantryItem
from ..serializers import PantryItemSerializer
from grocery_list.models import GroceryList, GroceryListItem

logger = logging.getLogger(__name__)

class PantryItemService:

    @staticmethod
    def list(user_id=None) -> Dict:
        """
        List all pantry items, optionally filtered by user
        """
        if user_id:
            pantry_items = PantryItem.objects.filter(user_id=user_id).order_by('ingredient__name')
        else:
            pantry_items = PantryItem.objects.all().order_by('ingredient__name')
        serializer = PantryItemSerializer(pantry_items, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        """
        Get a specific pantry item by ID
        """
        pantry_item = PantryItemService.__get(id=id)
        serializer = PantryItemSerializer(pantry_item)
        return serializer.data

    @staticmethod
    def create(validated_data) -> Dict:
        """
        Create a new pantry item
        """
        serializer = PantryItemSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def update(id, validated_data) -> Dict:
        """
        Update an existing pantry item
        """
        pantry_item = PantryItemService.__get(id=id)
        serializer = PantryItemSerializer(instance=pantry_item, data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def delete(id) -> Dict:
        """
        Delete a pantry item
        """
        pantry_item = PantryItemService.__get(id=id)
        pantry_item.delete()
        return {"status_code": 200}

    @staticmethod
    def add_grocery_list_to_pantry(grocery_list_id, user_id) -> Dict:
        """
        Add all items from a completed grocery list to the user's pantry
        """
        try:
            # Get the grocery list
            grocery_list = GroceryList.objects.get(id=grocery_list_id)
            
            # Mark the grocery list as completed
            grocery_list.completed = True
            grocery_list.save()
            
            # Get all purchased items from the grocery list
            grocery_items = GroceryListItem.objects.filter(
                grocery_list_id=grocery_list_id,
                purchased=True
            )
            
            added_items = []
            
            # Add each purchased item to the pantry
            for item in grocery_items:
                # Check if the item already exists in the pantry
                existing_item = PantryItem.objects.filter(
                    user_id=user_id,
                    ingredient_id=item.ingredient_id
                ).first()
                
                if existing_item:
                    # If the item exists, update the quantity
                    existing_item.quantity += item.quantity
                    existing_item.save()
                    added_items.append(existing_item)
                else:
                    # If the item doesn't exist, create a new pantry item
                    pantry_item = PantryItem.objects.create(
                        user_id=user_id,
                        ingredient_id=item.ingredient_id,
                        quantity=item.quantity,
                        unit=item.unit,
                        notes=item.notes
                    )
                    added_items.append(pantry_item)
            
            # Return the added items
            serializer = PantryItemSerializer(added_items, many=True)
            return {
                "status": "success",
                "message": f"Added {len(added_items)} items to pantry",
                "items": serializer.data
            }
        
        except GroceryList.DoesNotExist:
            return {
                "status": "error",
                "message": f"Grocery list with ID {grocery_list_id} not found"
            }
        except Exception as e:
            logger.error(f"Error adding grocery list to pantry: {str(e)}")
            return {
                "status": "error",
                "message": f"Error adding grocery list to pantry: {str(e)}"
            }

    @staticmethod
    def __get(id=id):
        """
        Helper method to get a pantry item by ID
        """
        return PantryItem.objects.filter(id=id).first()
