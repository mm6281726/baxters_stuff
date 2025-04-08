from rest_framework import serializers
from ..models import GroceryList, GroceryListItem
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

class GroceryListSerializer(serializers.ModelSerializer):
    items = GroceryListItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()
    purchased_count = serializers.SerializerMethodField()

    class Meta:
        model = GroceryList
        fields = ['id', 'title', 'description', 'completed', 'user', 'created_at', 'updated_at', 'items', 'item_count', 'purchased_count']
        extra_kwargs = {
            "description": {"required": False, "allow_blank": True, "allow_null": True},
            "user": {"required": False}
        }

    def get_item_count(self, obj):
        return obj.items.count()

    def get_purchased_count(self, obj):
        return obj.items.filter(purchased=True).count()