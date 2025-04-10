from django.urls import path

from .apis import LoginAPI, UserAPI, PasswordResetAPI, PasswordChangeAPI

urlpatterns = [
    path('', UserAPI.list),

    path('<int:id>/', UserAPI.detail),

    path('login/', LoginAPI.list),
    path('login/refresh/', LoginAPI.refresh),

    path('password-reset/', PasswordResetAPI.request_reset),
    path('password-reset/confirm/', PasswordResetAPI.confirm_reset),
    path('change-password/', PasswordChangeAPI.change_password),
]
