from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

class HomeViewTests(TestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username="testuser", password="password123")
        
    def test_unauthenticated_load_page(self):
        """
        Home page sends 302 status code when not authenticated.
        """
        response = self.client.get(reverse("home:home"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse("auth:login"))

    def test_authenticated_load_page(self):
        """
        Home page sends 200 status code when authenticated.
        """
        self.client.force_login(self.user)
        response = self.client.get(reverse("home:home"))
        self.assertEqual(response.status_code, 200)

class AboutViewTests(TestCase):
    def test_load_page(self):
        """
        About page sends 200 status code.
        """
        response = self.client.get(reverse("home:about"))
        self.assertEqual(response.status_code, 200)