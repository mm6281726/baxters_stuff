from typing import Dict

from ..models import Ingredient
from ..serializers import IngredientSerializer
from .category import IngredientCategoryService

class IngredientService:

    @staticmethod
    def list() -> Dict:
        ingredients = Ingredient.objects.all()
        serializer = IngredientSerializer(ingredients, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        ingredient = IngredientService.__get(id=id)
        serializer = IngredientSerializer(ingredient)
        return serializer.data
    
    @staticmethod
    def create(validated_data) -> Dict:
        validated_data['categories'] = IngredientService.__process_categoryids(validated_data)
        serializer = IngredientSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data
    
    @staticmethod
    def update(id, validated_data) -> Dict:
        ingredient = IngredientService.__get(id=id)
        validated_data['categories'] = IngredientService.__process_categoryids(validated_data)
        serializer = IngredientSerializer(instance=ingredient, data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data
    
    @staticmethod
    def delete(id) -> Dict:
        ingredient = IngredientService.__get(id=id)
        ingredient.delete()
        return {"status_code": 200}
    
    @staticmethod
    def __get(id=id):
        return Ingredient.objects.filter(id=id).first()
    
    @staticmethod
    def __process_categoryids(validated_data):
        return IngredientCategoryService.list(validated_data['categories'])