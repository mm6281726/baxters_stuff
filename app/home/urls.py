from django.urls import path

from django.views.generic import RedirectView

from . import views

app_name = "home"
urlpatterns = [
    path("", views.HomeView.as_view(), name="home"),
    path("about/", views.AboutView.as_view(), name="about"),
    
    path("login/", RedirectView.as_view(url='/auth/login/')),
    path("register/", RedirectView.as_view(url='/auth/register/')),
]