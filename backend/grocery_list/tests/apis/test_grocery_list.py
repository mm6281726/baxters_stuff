import json
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from grocery_list.models import GroceryList

User = get_user_model()

class GroceryListAPITest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )

        # Create a test grocery list
        self.grocery_list = GroceryList.objects.create(
            title='Test Grocery List',
            description='Test Description',
            user=self.user
        )

        # Set up the API client
        self.client = APIClient()

        # Authenticate the client
        self.client.force_authenticate(user=self.user)

    def test_list_grocery_lists(self):
        """Test retrieving a list of grocery lists"""
        url = '/api/grocerylist/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # Check that our test grocery list is in the response
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'Test Grocery List')
        self.assertEqual(data[0]['description'], 'Test Description')

    def test_create_grocery_list(self):
        """Test creating a new grocery list"""
        url = '/api/grocerylist/'
        data = {
            'title': 'New Grocery List',
            'description': 'New Description',
            'user': self.user.id
        }

        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

        # Check that the grocery list was created
        created_list = GroceryList.objects.get(title='New Grocery List')
        self.assertEqual(created_list.description, 'New Description')
        self.assertEqual(created_list.user, self.user)

    def test_get_grocery_list_detail(self):
        """Test retrieving a specific grocery list"""
        url = f'/api/grocerylist/{self.grocery_list.id}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(data['title'], 'Test Grocery List')
        self.assertEqual(data['description'], 'Test Description')

    def test_update_grocery_list(self):
        """Test updating a grocery list"""
        url = f'/api/grocerylist/{self.grocery_list.id}/'
        data = {
            'title': 'Updated Grocery List',
            'description': 'Updated Description',
            'completed': True
        }

        response = self.client.put(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

        # Refresh from database
        self.grocery_list.refresh_from_db()

        # Check that the grocery list was updated
        self.assertEqual(self.grocery_list.title, 'Updated Grocery List')
        self.assertEqual(self.grocery_list.description, 'Updated Description')
        self.assertTrue(self.grocery_list.completed)

    def test_delete_grocery_list(self):
        """Test deleting a grocery list"""
        url = f'/api/grocerylist/{self.grocery_list.id}/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, 200)

        # Check that the grocery list was deleted
        with self.assertRaises(GroceryList.DoesNotExist):
            GroceryList.objects.get(id=self.grocery_list.id)
