from django.urls import path

from . import views

app_name = "grocery_items"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("detail/<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("detail/<int:grocery_item_id>/update/", views.update, name="update"),
]