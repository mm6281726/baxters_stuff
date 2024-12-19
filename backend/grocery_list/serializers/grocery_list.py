from rest_framework import serializers
from ..models import GroceryList

class GroceryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryList
        fields = '__all__'
        extra_kwargs = {
            "description": {"required": False, "allow_blank": True, "allow_null": True}
        }