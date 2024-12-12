from typing import Dict

from ..models import Ingredient
from ..serializers import IngredientSerializer

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
        ingredient = Ingredient.objects.create(**validated_data)
        serializer = IngredientSerializer(ingredient)
        return serializer.data
    
    @staticmethod
    def update(id, validated_data) -> Dict:
        ingredient_filter = Ingredient.objects.filter(id=id)
        ingredient_filter.update(**validated_data)
        ingredient = ingredient_filter.first()
        serializer = IngredientSerializer(ingredient)
        return serializer.data
    
    @staticmethod
    def delete(id) -> Dict:
        ingredient = IngredientService.__get(id=id)
        ingredient.delete()
        return {"status_code": 200}
    
    @staticmethod
    def __get(id=id):
        return Ingredient.objects.filter(id=id).first()