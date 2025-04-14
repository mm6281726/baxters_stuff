from rest_framework import serializers
from ..models import PantryItem
from ingredient.serializers import IngredientSerializer

class PantryItemSerializer(serializers.ModelSerializer):
    ingredient_details = IngredientSerializer(source='ingredient', read_only=True)

    class Meta:
        model = PantryItem
        fields = ['id', 'user', 'ingredient', 'ingredient_details', 'quantity', 'unit', 'stock_level', 'notes', 'created_at', 'updated_at']
        extra_kwargs = {
            "notes": {"required": False, "allow_blank": True, "allow_null": True},
            "unit": {"required": False, "allow_blank": True, "allow_null": True},
            "quantity": {"required": False, "allow_null": True},
            "stock_level": {"required": False},
            "user": {"required": False}
        }
