import logging
from typing import Dict

from ..models import Recipe
from ..serializers import RecipeSerializer

logger = logging.getLogger(__name__)

class RecipeService:

    @staticmethod
    def list(user_id=None) -> Dict:
        """
        List all recipes, optionally filtered by user
        """
        if user_id:
            recipes = Recipe.objects.filter(user_id=user_id)
        else:
            recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        """
        Get a specific recipe by ID
        """
        recipe = RecipeService.__get(id=id)
        serializer = RecipeSerializer(recipe)
        return serializer.data

    @staticmethod
    def create(validated_data, user_id=None) -> Dict:
        """
        Create a new recipe
        """
        # Add user to the data if provided
        if user_id:
            validated_data['user'] = user_id

        serializer = RecipeSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def update(id, validated_data) -> Dict:
        """
        Update an existing recipe
        """
        recipe = RecipeService.__get(id=id)
        serializer = RecipeSerializer(instance=recipe, data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def delete(id) -> Dict:
        """
        Delete a recipe
        """
        recipe = RecipeService.__get(id=id)
        recipe.delete()
        return {"status_code": 200}

    @staticmethod
    def __get(id=id):
        """
        Helper method to get a recipe by ID
        """
        return Recipe.objects.filter(id=id).first()
