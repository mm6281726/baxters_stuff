from django.urls import path
from .apis.rest import GroceryListAPI

urlpatterns = [
    path('', GroceryListAPI.list),
    path('<int:id>/', GroceryListAPI.detail),
]