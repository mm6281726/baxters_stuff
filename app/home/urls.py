from django.urls import path

from django.views.generic import RedirectView

from . import views

app_name = "home"
urlpatterns = [
    path("", views.index, name="home"),
    path("about/", views.about, name="about"),
    
    path("login/", RedirectView.as_view(url='/auth/login/')),
    path("register/", RedirectView.as_view(url='/auth/register/')),
]