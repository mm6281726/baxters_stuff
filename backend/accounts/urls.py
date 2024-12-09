from django.urls import path

from .apis import LoginAPI, UserAPI

urlpatterns = [
    path('', UserAPI.list),
    path('<int:id>/', UserAPI.detail),

    path('login/', LoginAPI.list),
    path('login/refresh/', LoginAPI.refresh),
]
