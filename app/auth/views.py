from django.contrib.auth.views import LoginView
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView

from .forms import RegisterForm

class LoginView(LoginView):
    template_name = "auth/login.html"
    redirect_authenticated_user = True
    success_url = reverse_lazy('home:home')

class RegisterView(CreateView):   
    form_class = RegisterForm
    template_name = 'auth/register.html'
    success_url = reverse_lazy('auth:login')

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home:home')
        return super(RegisterView, self).dispatch(request, *args, **kwargs)