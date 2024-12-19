from typing import Dict

from ..models import IngredientCategory
from ..serializers import IngredientCategorySerializer

class IngredientCategoryService:

    @staticmethod
    def list(category_ids=None) -> Dict:
        if category_ids is None:
            ingredientCategories = IngredientCategory.objects.all()
        else:
            ingredientCategories = IngredientCategory.objects.filter(id__in=category_ids)
        serializer = IngredientCategorySerializer(ingredientCategories, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        ingredientCategory = IngredientCategoryService.__get(id=id)
        serializer = IngredientCategorySerializer(ingredientCategory)
        return serializer.data
    
    @staticmethod
    def create(validated_data) -> Dict:
        serializer = IngredientCategorySerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data
    
    @staticmethod
    def update(id, validated_data) -> Dict:
        category = IngredientCategoryService.__get(id=id)
        serializer = IngredientCategorySerializer(instance=category, data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data
    
    @staticmethod
    def delete(id) -> Dict:
        ingredientCategory = IngredientCategoryService.__get(id=id)
        ingredientCategory.delete()
        return {"status_code": 200}
    
    @staticmethod
    def __get(id=id):
        return IngredientCategory.objects.filter(id=id).first()