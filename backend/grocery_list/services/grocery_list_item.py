from typing import Dict

from ..models import GroceryListItem
from ..serializers import GroceryListItemSerializer

class GroceryListItemService:

    @staticmethod
    def list(grocery_list_id) -> Dict:
        # Get items sorted by ingredient name for consistent ordering
        items = GroceryListItem.objects.filter(grocery_list_id=grocery_list_id).order_by('ingredient__name')
        serializer = GroceryListItemSerializer(items, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        item = GroceryListItemService.__get(id=id)
        serializer = GroceryListItemSerializer(item)
        return serializer.data

    @staticmethod
    def create(validated_data) -> Dict:
        serializer = GroceryListItemSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def update(id, validated_data) -> Dict:
        item = GroceryListItemService.__get(id=id)
        serializer = GroceryListItemSerializer(instance=item, data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def delete(id) -> Dict:
        item = GroceryListItemService.__get(id=id)
        item.delete()
        return {"status_code": 200}

    @staticmethod
    def __get(id=id):
        return GroceryListItem.objects.filter(id=id).first()
