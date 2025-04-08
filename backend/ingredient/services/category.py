from typing import Dict

from ..models import IngredientCategory
from ..serializers import IngredientCategorySerializer

class IngredientCategoryService:

    @staticmethod
    def list(category_ids=None) -> Dict:
        if category_ids is None:
            ingredientCategories = IngredientCategory.objects.all().order_by('name')
        else:
            ingredientCategories = IngredientCategory.objects.filter(id__in=category_ids).order_by('name')
        serializer = IngredientCategorySerializer(ingredientCategories, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        ingredientCategory = IngredientCategoryService.__get(id=id)
        serializer = IngredientCategorySerializer(ingredientCategory)
        return serializer.data

    @staticmethod
    def create(validated_data) -> Dict:
        import logging
        logger = logging.getLogger(__name__)

        logger.info(f'Creating category with data: {validated_data}')
        serializer = IngredientCategorySerializer(data=validated_data)

        if serializer.is_valid():
            logger.info('Serializer is valid, saving category')
            serializer.save()
            logger.info(f'Category saved successfully: {serializer.data}')
            return serializer.data
        else:
            logger.error(f'Serializer validation errors: {serializer.errors}')
            return {"error": serializer.errors}

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