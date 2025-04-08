from rest_framework import serializers
from ..models import GroceryListItem
from ingredient.serializers import IngredientSerializer

class GroceryListItemSerializer(serializers.ModelSerializer):
    ingredient_details = IngredientSerializer(source='ingredient', read_only=True)

    class Meta:
        model = GroceryListItem
        fields = ['id', 'grocery_list', 'ingredient', 'ingredient_details', 'quantity', 'unit', 'purchased', 'notes']
        extra_kwargs = {
            "notes": {"required": False, "allow_blank": True, "allow_null": True},
            "unit": {"required": False, "allow_blank": True, "allow_null": True}
        }
