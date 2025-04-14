from typing import Dict

from ..models import Ingredient
from ..serializers import IngredientSerializer
from .category import IngredientCategoryService

class IngredientService:

    @staticmethod
    def list() -> Dict:
        # Get all ingredients ordered by name
        ingredients = Ingredient.objects.all().order_by('name')
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
    def find_or_create_ingredient(name, user_id=None, categories=None):
        """
        Find an existing ingredient by name or create a new one

        Args:
            name: The name of the ingredient to find or create
            user_id: The ID of the user creating the ingredient (if needed)
            categories: Optional list of category IDs to assign to the ingredient

        Returns:
            Ingredient object (either existing or newly created)
        """
        # Try to find an existing ingredient with the same name
        name = name.strip().lower()
        ingredient = Ingredient.objects.filter(name__iexact=name).first()

        if ingredient:
            return ingredient

        # Create a new ingredient if none exists
        validated_data = {
            'name': name.capitalize(),
            'description': '',
            'categories': categories or []
        }

        # Process categories if provided
        if categories:
            validated_data['categories'] = IngredientService.__process_categoryids(categories)

        # Create the ingredient
        serializer = IngredientSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
            # Get the newly created ingredient
            return Ingredient.objects.get(id=serializer.data['id'])
        else:
            # If there was an error, create a basic ingredient without categories
            return Ingredient.objects.create(name=name.capitalize(), description='')

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
