from rest_framework import serializers

from ..models import IngredientCategory

class IngredientCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientCategory
        fields = '__all__'
        extra_kwargs = {
            'description': {'required': False, 'allow_blank': True, 'allow_null': True}
        }