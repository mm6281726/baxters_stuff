from django.urls import path
from .apis import PantryItemAPI
from .apis.unit_conversion import convert_pantry_item_units, convert_grocery_to_pantry

urlpatterns = [
    # Pantry Item endpoints
    path('', PantryItemAPI.list),
    path('<int:id>/', PantryItemAPI.detail),

    # Add grocery list to pantry endpoint
    path('add-grocery-list/<int:grocery_list_id>/', PantryItemAPI.add_grocery_list),

    # Unit conversion endpoints
    path('convert-units/<int:pantry_item_id>/', convert_pantry_item_units),
    path('add-from-grocery/<int:grocery_item_id>/', convert_grocery_to_pantry),
]
