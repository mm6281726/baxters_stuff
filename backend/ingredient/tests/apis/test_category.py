from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
import json

from ...models import IngredientCategory

User = get_user_model()

class IngredientCategoryAPITests(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )

        # Create test categories
        self.category1 = IngredientCategory.objects.create(
            name="Test Category 1",
            description="Test Description 1"
        )
        self.category2 = IngredientCategory.objects.create(
            name="Test Category 2",
            description="Test Description 2"
        )

        # Set up the API client
        self.client = APIClient()

        # Get token
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)

        # Add token to client
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {access_token}')

    def test_get_all_categories(self):
        """Test retrieving all categories"""
        response = self.client.get('/api/ingredients/categories/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data), 2)

    def test_get_single_category(self):
        """Test retrieving a single category"""
        response = self.client.get(f'/api/ingredients/categories/{self.category1.id}/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['name'], 'Test Category 1')

    def test_create_category_with_description(self):
        """Test creating a category with a description"""
        payload = {
            'name': 'New Category',
            'description': 'New Description'
        }
        response = self.client.post(
            '/api/ingredients/categories/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['name'], 'New Category')
        self.assertEqual(data['description'], 'New Description')

    def test_create_category_with_blank_description(self):
        """Test creating a category with a blank description"""
        payload = {
            'name': 'Blank Description Category',
            'description': ''
        }
        response = self.client.post(
            '/api/ingredients/categories/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['name'], 'Blank Description Category')
        self.assertEqual(data['description'], '')

    def test_create_category_without_description(self):
        """Test creating a category without providing a description"""
        payload = {
            'name': 'No Description Category'
        }
        response = self.client.post(
            '/api/ingredients/categories/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['name'], 'No Description Category')
        self.assertIsNone(data['description'])

    def test_update_category(self):
        """Test updating a category"""
        payload = {
            'name': 'Updated Category',
            'description': 'Updated Description'
        }
        response = self.client.put(
            f'/api/ingredients/categories/{self.category1.id}/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['name'], 'Updated Category')
        self.assertEqual(data['description'], 'Updated Description')

    def test_update_category_blank_description(self):
        """Test updating a category with a blank description"""
        payload = {
            'name': 'Blank Description Update',
            'description': ''
        }
        response = self.client.put(
            f'/api/ingredients/categories/{self.category1.id}/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['name'], 'Blank Description Update')
        self.assertEqual(data['description'], '')

    def test_delete_category(self):
        """Test deleting a category"""
        response = self.client.delete(f'/api/ingredients/categories/{self.category1.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(IngredientCategory.objects.count(), 1)
