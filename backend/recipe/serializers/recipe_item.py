from rest_framework import serializers
from ..models import RecipeItem
from ingredient.serializers import IngredientSerializer

class RecipeItemSerializer(serializers.ModelSerializer):
    ingredient_details = IngredientSerializer(source='ingredient', read_only=True)

    class Meta:
        model = RecipeItem
        fields = ['id', 'recipe', 'ingredient', 'ingredient_details', 'quantity', 'unit', 'notes']
        extra_kwargs = {
            "notes": {"required": False, "allow_blank": True, "allow_null": True},
            "unit": {"required": False, "allow_blank": True, "allow_null": True}
        }
