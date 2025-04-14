import json
from django.test import TestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from ...models import Recipe

User = get_user_model()

class RecipeScannerAPITests(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )

        # Create a test client
        self.client = APIClient()

        # Get token
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)

        # Add token to client
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {access_token}')

        # Define API endpoints
        self.scan_url = '/api/recipes/scan/'
        self.create_from_scan_url = '/api/recipes/create-from-scan/'

    @patch('recipe.services.RecipeScannerService.scan_url')
    def test_scan_endpoint(self, mock_scan_url):
        """Test the scan endpoint"""
        # Mock the scan_url method
        mock_scan_url.return_value = {
            'title': 'Test Recipe',
            'description': 'A test recipe',
            'prep_time': 15,
            'cook_time': 30,
            'servings': 4,
            'ingredients': [
                {'name': 'Salt', 'quantity': 1, 'unit': 'tsp', 'notes': None}
            ],
            'steps': [
                {'step_number': 1, 'description': 'Mix ingredients.'}
            ]
        }

        # Make a POST request to the scan endpoint
        response = self.client.post(
            self.scan_url,
            json.dumps({'url': 'https://example.com/recipe'}),
            content_type='application/json'
        )

        # Verify the response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['title'], 'Test Recipe')
        self.assertEqual(len(data['ingredients']), 1)
        self.assertEqual(len(data['steps']), 1)

        # Verify the service was called with the correct arguments
        mock_scan_url.assert_called_once_with(url='https://example.com/recipe', user_id=self.user.id)

    def test_scan_endpoint_missing_url(self):
        """Test the scan endpoint with a missing URL"""
        # Make a POST request without a URL
        response = self.client.post(
            self.scan_url,
            json.dumps({}),
            content_type='application/json'
        )

        # Verify the response
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content)
        self.assertIn('error', data)

    @patch('recipe.services.RecipeScannerService.create_recipe_from_scan')
    def test_create_from_scan_endpoint(self, mock_create_from_scan):
        """Test the create_from_scan endpoint"""
        # Mock the create_recipe_from_scan method
        mock_create_from_scan.return_value = {
            'id': 1,
            'title': 'Test Recipe',
            'description': 'A test recipe',
            'prep_time': 15,
            'cook_time': 30,
            'servings': 4,
            'items': [],
            'steps': []
        }

        # Create test scan data
        scan_data = {
            'title': 'Test Recipe',
            'description': 'A test recipe',
            'prep_time': 15,
            'cook_time': 30,
            'servings': 4,
            'ingredients': [
                {'name': 'Salt', 'quantity': 1, 'unit': 'tsp', 'notes': None}
            ],
            'steps': [
                {'step_number': 1, 'description': 'Mix ingredients.'}
            ]
        }

        # Make a POST request to the create_from_scan endpoint
        response = self.client.post(
            self.create_from_scan_url,
            json.dumps(scan_data),
            content_type='application/json'
        )

        # Verify the response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['title'], 'Test Recipe')

        # Verify the service was called with the correct arguments
        mock_create_from_scan.assert_called_once_with(scan_data=scan_data, user_id=self.user.id)

    def test_create_from_scan_endpoint_unauthenticated(self):
        """Test the create_from_scan endpoint with an unauthenticated user"""
        # Create a client without authentication
        client = APIClient()

        # Make a POST request to the create_from_scan endpoint
        response = client.post(
            self.create_from_scan_url,
            json.dumps({}),
            content_type='application/json'
        )

        # Verify the response
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content)
        # Check for any authentication error message
        self.assertTrue('message' in data or 'error' in data or 'detail' in data)
