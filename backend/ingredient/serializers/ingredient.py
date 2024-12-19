from rest_framework import serializers

from ..models import Ingredient
from .category import IngredientCategorySerializer

class IngredientSerializer(serializers.ModelSerializer):
    categories = IngredientCategorySerializer(many=True)

    class Meta:
        model = Ingredient
        fields = '__all__'
        extra_kwargs = {
            "description": {"required": False, "allow_blank": True, "allow_null": True}
        }

    def create(self, validated_data):
        validated_data.pop('categories', None)
        
        ingredient = Ingredient.objects.create(**validated_data)
        IngredientSerializer.__update_categories(self, ingredient)
        return ingredient
    
    def update(self, instance, validated_data):
        validated_data.pop('categories', None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        IngredientSerializer.__update_categories(self, instance)
        instance.save()
        return instance
    

    def __update_categories(self, ingredient):
        categories = IngredientSerializer.__get_categories(self)
        ingredient.categories.set(categories)


    def __get_categories(self):
        return [category['id'] for category in self.initial_data.get('categories')]