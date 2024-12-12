from django.urls import path
from .apis.rest import IngredientsAPI

urlpatterns = [
    path('', IngredientsAPI.list),
    path('<int:id>/', IngredientsAPI.detail),
]