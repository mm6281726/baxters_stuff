from django.contrib import admin
from django.urls import path, include

from accounts import urls as accounts_urls
from grocery_list import urls as grocery_list_urls

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/grocerylist/', include(grocery_list_urls)),
    path('api/accounts/', include(accounts_urls)),
]
