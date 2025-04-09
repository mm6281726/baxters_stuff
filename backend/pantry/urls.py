from django.urls import path
from .apis import PantryItemAPI

urlpatterns = [
    # Pantry Item endpoints
    path('', PantryItemAPI.list),
    path('<int:id>/', PantryItemAPI.detail),
    
    # Add grocery list to pantry endpoint
    path('add-grocery-list/<int:grocery_list_id>/', PantryItemAPI.add_grocery_list),
]
