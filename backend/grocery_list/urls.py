from django.urls import path
from .apis.rest import GroceryListAPI

urlpatterns = [
    path("", GroceryListAPI.list),
    path("<int:pk>/", GroceryListAPI.detail),
]