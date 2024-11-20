from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

class LoginViewTests(TestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username="testuser", password="password123")

    def test_unauthenticated_load_page(self):
        """
        Login page sends 200 status code.
        """
        response = self.client.get(reverse("auth:login"))
        self.assertEqual(response.status_code, 200)

    def test_authenticated_load_page(self):
        """
        Login page sends 302 status code and redirects.
        """
        self.client.force_login(self.user)
        response = self.client.get(reverse("auth:login"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse("home:home"))

class RegisterViewTests(TestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username="testuser", password="password123")

    def test_unauthenticated_load_page(self):
        """
        Register page sends 200 status code.
        """
        response = self.client.get(reverse("auth:register"))
        self.assertEqual(response.status_code, 200)

    def test_authenticated_load_page(self):
        """
        Register page sends 302 status code and redirects.
        """
        self.client.force_login(self.user)
        response = self.client.get(reverse("auth:register"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse("home:home"))

    def test_successful_registration(self):
        """
        User is created from registration.
        """
        response = self.client.post('/auth/register/', {
            'username': 'test1',
            'email': 'test@test.com',
            'password1': 'unique12345',
            'password2': 'unique12345',
        })
        self.assertTrue(User.objects.filter(username='test1').exists())
        self.assertRedirects(response, reverse("auth:login"))

    def test_bad_password_registration(self):
        """
        User is not created from registration because password is not valid.
        """
        response = self.client.post('/auth/register/', {
            'username': 'test1',
            'email': 'test@test.com',
            'password1': 'password123',
            'password2': 'password123',
        })
        self.assertFalse(User.objects.filter(username='test1').exists())

    def test_no_email_registration(self):
        """
        User is not created from registration because no email.
        """
        response = self.client.post('/auth/register/', {
            'username': 'test1',
            'email': '',
            'password1': 'unique12345',
            'password2': 'unique12345',
        })
        self.assertFalse(User.objects.filter(username='test1').exists())