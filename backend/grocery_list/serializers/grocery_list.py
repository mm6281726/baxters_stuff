from rest_framework import serializers
from ..models import GroceryList
from .grocery_list_item import GroceryListItemSerializer

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