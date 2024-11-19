from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.views.generic import TemplateView

class HomeView(TemplateView):
    template_name = 'home/home.html'

    def dispatch(self, request, *args, **kwargs):
        userAuthenticated = request.user.is_authenticated
        usersExist = User.objects.all().count() > 0
        if userAuthenticated:
            return super(HomeView, self).dispatch(request, *args, **kwargs)
        elif usersExist:
            return redirect('auth:login')
        else:
            return redirect('auth:register')

class AboutView(TemplateView):
    template_name = 'home/about.html'