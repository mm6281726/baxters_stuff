from django.contrib import admin
from django.urls import path, include

from accounts import urls as accounts_urls
from grocery_list import urls as grocery_list_urls
from ingredient import urls as ingredient_urls
from pantry import urls as pantry_urls
from recipe import urls as recipe_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include(accounts_urls)),
    path('api/grocerylist/', include(grocery_list_urls)),
    path('api/ingredients/', include(ingredient_urls)),
    path('api/pantry/', include(pantry_urls)),
    path('api/recipes/', include(recipe_urls)),
]
