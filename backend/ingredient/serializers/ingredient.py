from rest_framework import serializers

from ..models import Ingredient, IngredientCategory

from .category import IngredientCategorySerializer

class IngredientSerializer(serializers.ModelSerializer):
    categories = IngredientCategorySerializer(many=True)

    class Meta:
        model = Ingredient
        fields = '__all__'

    def create(self, validated_data):
        validated_data.pop('categories', None)
        
        ingredient = Ingredient.objects.create(**validated_data)
        IngredientSerializer.__update_categories(self, ingredient)
        return ingredient
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name')
        instance.description = validated_data.get('description')
        IngredientSerializer.__update_categories(self, instance)
        instance.save()
        return instance
    

    def __update_categories(self, ingredient):
        categories = IngredientSerializer.__get_categories(self)
        ingredient.categories.set(categories)


    def __get_categories(self):
        return [category['id'] for category in self.initial_data.get('categories')]