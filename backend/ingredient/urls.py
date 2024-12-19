from django.urls import path
from .apis.rest import IngredientAPI, IngredientCategoryAPI

urlpatterns = [
    path('', IngredientAPI.list),
    path('<int:id>/', IngredientAPI.detail),

    path('categories/', IngredientCategoryAPI.list),
    path('categories/<int:id>/', IngredientCategoryAPI.detail),
]