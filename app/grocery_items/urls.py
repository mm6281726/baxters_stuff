from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("items/<int:grocery_item_id>/", views.detail, name="detail"),
]