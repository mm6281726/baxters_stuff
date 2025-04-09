from rest_framework import serializers
from ..models import Recipe
from .recipe_item import RecipeItemSerializer
from .recipe_step import RecipeStepSerializer

class RecipeSerializer(serializers.ModelSerializer):
    items = RecipeItemSerializer(many=True, read_only=True)
    steps = RecipeStepSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'prep_time', 'cook_time', 'servings', 
                 'user', 'created_at', 'updated_at', 'items', 'steps', 'item_count']
        extra_kwargs = {
            "description": {"required": False, "allow_blank": True, "allow_null": True},
            "prep_time": {"required": False, "allow_null": True},
            "cook_time": {"required": False, "allow_null": True},
            "servings": {"required": False, "allow_null": True},
            "user": {"required": False}
        }

    def get_item_count(self, obj):
        return obj.items.count()
