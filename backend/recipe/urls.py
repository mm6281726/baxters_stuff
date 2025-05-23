from django.urls import path
from .apis import RecipeAPI, RecipeItemAPI, RecipeStepAPI, RecipeScannerAPI, RecipeImageScannerAPI

urlpatterns = [
    # Recipe endpoints
    path('', RecipeAPI.list),
    path('<int:id>/', RecipeAPI.detail),

    # Recipe Item endpoints
    path('<int:recipe_id>/items/', RecipeItemAPI.list),
    path('items/<int:id>/', RecipeItemAPI.detail),

    # Recipe Step endpoints
    path('<int:recipe_id>/steps/', RecipeStepAPI.list),
    path('steps/<int:id>/', RecipeStepAPI.detail),

    # Add recipe items to grocery list endpoint
    path('<int:recipe_id>/add-to-grocery-list/<int:grocery_list_id>/', RecipeItemAPI.add_to_grocery_list),

    # Recipe Scanner endpoints
    path('scan/', RecipeScannerAPI.scan),
    path('scan-image/', RecipeImageScannerAPI.scan_image),
    path('create-from-scan/', RecipeScannerAPI.create_from_scan),
]
