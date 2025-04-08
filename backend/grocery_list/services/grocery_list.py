from typing import Dict, List

from ..models import GroceryList, GroceryListItem
from ..serializers import GroceryListSerializer, GroceryListItemSerializer
from ingredient.models import Ingredient

class GroceryListItemService:

    @staticmethod
    def list(grocery_list_id) -> Dict:
        items = GroceryListItem.objects.filter(grocery_list_id=grocery_list_id)
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


class GroceryListService:

    @staticmethod
    def list(user_id=None) -> Dict:
        if user_id:
            grocery_lists = GroceryList.objects.filter(user_id=user_id)
        else:
            grocery_lists = GroceryList.objects.all()
        serializer = GroceryListSerializer(grocery_lists, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        grocery_list = GroceryListService.__get(id=id)
        serializer = GroceryListSerializer(grocery_list)
        return serializer.data

    @staticmethod
    def create(validated_data, user_id=None) -> Dict:
        # Add user to the data if provided
        if user_id:
            validated_data['user'] = user_id

        serializer = GroceryListSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def update(id, validated_data) -> Dict:
        grocery_list = GroceryListService.__get(id=id)
        serializer = GroceryListSerializer(instance=grocery_list, data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def delete(id) -> Dict:
        grocery_list = GroceryListService.__get(id=id)
        grocery_list.delete()
        return {"status_code": 200}

    @staticmethod
    def __get(id=id):
        return GroceryList.objects.filter(id=id).first()