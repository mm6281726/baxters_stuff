from django.contrib import admin

from .models import Ingredient
from .models import IngredientCategory

class IngredientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description',)

admin.site.register(Ingredient, IngredientAdmin)

class IngredientCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description',)

admin.site.register(IngredientCategory, IngredientCategoryAdmin)
