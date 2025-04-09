from rest_framework import serializers
from ..models import RecipeStep

class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = ['id', 'recipe', 'step_number', 'description']
