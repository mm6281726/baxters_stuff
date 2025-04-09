import logging
from typing import Dict

from ..models import RecipeStep
from ..serializers import RecipeStepSerializer

logger = logging.getLogger(__name__)

class RecipeStepService:

    @staticmethod
    def list(recipe_id) -> Dict:
        """
        List all steps for a recipe
        """
        steps = RecipeStep.objects.filter(recipe_id=recipe_id).order_by('step_number')
        serializer = RecipeStepSerializer(steps, many=True)
        return serializer.data

    @staticmethod
    def get(id) -> Dict:
        """
        Get a specific recipe step by ID
        """
        step = RecipeStepService.__get(id=id)
        serializer = RecipeStepSerializer(step)
        return serializer.data

    @staticmethod
    def create(validated_data) -> Dict:
        """
        Create a new recipe step
        """
        # If step_number is not provided, set it to the next available number
        if 'step_number' not in validated_data or not validated_data['step_number']:
            recipe_id = validated_data['recipe']
            last_step = RecipeStep.objects.filter(recipe_id=recipe_id).order_by('-step_number').first()
            validated_data['step_number'] = 1 if not last_step else last_step.step_number + 1
            
        serializer = RecipeStepSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def update(id, validated_data) -> Dict:
        """
        Update an existing recipe step
        """
        step = RecipeStepService.__get(id=id)
        serializer = RecipeStepSerializer(instance=step, data=validated_data)
        if serializer.is_valid():
            serializer.save()
        return serializer.data

    @staticmethod
    def delete(id) -> Dict:
        """
        Delete a recipe step
        """
        step = RecipeStepService.__get(id=id)
        recipe_id = step.recipe_id
        step_number = step.step_number
        step.delete()
        
        # Reorder the remaining steps
        remaining_steps = RecipeStep.objects.filter(
            recipe_id=recipe_id, 
            step_number__gt=step_number
        ).order_by('step_number')
        
        for remaining_step in remaining_steps:
            remaining_step.step_number -= 1
            remaining_step.save()
            
        return {"status_code": 200}

    @staticmethod
    def __get(id=id):
        """
        Helper method to get a recipe step by ID
        """
        return RecipeStep.objects.filter(id=id).first()
