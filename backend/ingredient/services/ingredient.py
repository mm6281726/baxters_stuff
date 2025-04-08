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
        validated_data['categories'] = IngredientService.__process_categoryids(validated_data['categories'])
        serializer = IngredientSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def update(id, validated_data) -> Dict:
        ingredient = IngredientService.__get(id=id)
        validated_data['categories'] = IngredientService.__process_categoryids(validated_data['categories'])
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
    def __process_categoryids(categories):
        if not categories:
            return []
        
        category_ids = []
        for category in categories:
            if isinstance(category, int):
                category_ids.append(category)
            elif isinstance(category, dict):
                # Get first non-None value from any of these keys
                for key in ['id', 'value', 'category_id']:
                    if category.get(key) is not None:
                        category_ids.append(category[key])
                        break
        
        category_ids = [cid for cid in category_ids if cid is not None]

        return IngredientCategoryService.list(category_ids)
