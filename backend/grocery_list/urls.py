from django.urls import path
from .apis import GroceryListAPI, GroceryListItemAPI

urlpatterns = [
    # Grocery List endpoints
    path('', GroceryListAPI.list),
    path('<int:id>/', GroceryListAPI.detail),

    # Grocery List Item endpoints
    path('<int:grocery_list_id>/items/', GroceryListItemAPI.list),
    path('items/<int:id>/', GroceryListItemAPI.detail),
]