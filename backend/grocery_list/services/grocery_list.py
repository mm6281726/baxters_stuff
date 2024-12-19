from typing import Dict

from ..models import GroceryList
from ..serializers import GroceryListSerializer

class GroceryListService:

    @staticmethod
    def list() -> Dict:
        grocery_lists = GroceryList.objects.all()
        serializer = GroceryListSerializer(grocery_lists, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        grocery_list = GroceryListService.__get(id=id)
        serializer = GroceryListSerializer(grocery_list)
        return serializer.data
    
    @staticmethod
    def create(validated_data) -> Dict:
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