import json
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from grocery_list.models import GroceryList, GroceryListItem
from ingredient.models import Ingredient

User = get_user_model()

class GroceryListItemAPITest(TestCase):
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
            user=self.user
        )

        # Create test ingredients
        self.ingredient1 = Ingredient.objects.create(
            name='Apple',
            description='Red fruit'
        )

        self.ingredient2 = Ingredient.objects.create(
            name='Banana',
            description='Yellow fruit'
        )

        # Create a test grocery list item with no unit (integer quantity)
        self.item_no_unit = GroceryListItem.objects.create(
            grocery_list=self.grocery_list,
            ingredient=self.ingredient1,
            quantity=2
        )

        # Create a test grocery list item with a unit (decimal quantity)
        self.item_with_unit = GroceryListItem.objects.create(
            grocery_list=self.grocery_list,
            ingredient=self.ingredient2,
            quantity=2.5,
            unit='kg'
        )

        # Set up the API client
        self.client = APIClient()

        # Authenticate the client
        self.client.force_authenticate(user=self.user)

    def test_list_grocery_list_items(self):
        """Test retrieving items for a specific grocery list"""
        url = f'/api/grocerylist/{self.grocery_list.id}/items/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(len(data), 2)

        # Check that both items are in the response
        item_ids = [item['id'] for item in data]
        self.assertIn(self.item_no_unit.id, item_ids)
        self.assertIn(self.item_with_unit.id, item_ids)

    def test_create_grocery_list_item_no_unit(self):
        """Test creating a grocery list item without a unit (integer quantity)"""
        url = f'/api/grocerylist/{self.grocery_list.id}/items/'
        data = {
            'grocery_list': self.grocery_list.id,
            'ingredient': self.ingredient1.id,
            'quantity': 3
        }

        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

        # Check that the item was created
        created_item = GroceryListItem.objects.get(
            grocery_list=self.grocery_list,
            ingredient=self.ingredient1,
            quantity=3
        )
        self.assertIsNone(created_item.unit)

    def test_create_grocery_list_item_with_unit(self):
        """Test creating a grocery list item with a unit (decimal quantity)"""
        url = f'/api/grocerylist/{self.grocery_list.id}/items/'
        data = {
            'grocery_list': self.grocery_list.id,
            'ingredient': self.ingredient2.id,
            'quantity': 1.5,
            'unit': 'kg'
        }

        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

        # Check that the item was created
        created_item = GroceryListItem.objects.get(
            grocery_list=self.grocery_list,
            ingredient=self.ingredient2,
            quantity=1.5
        )
        self.assertEqual(created_item.unit, 'kg')

    def test_update_grocery_list_item(self):
        """Test updating a grocery list item"""
        url = f'/api/grocerylist/items/{self.item_no_unit.id}/'
        data = {
            'grocery_list': self.grocery_list.id,
            'ingredient': self.ingredient1.id,
            'quantity': 5,
            'purchased': True
        }

        response = self.client.put(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

        # Refresh from database
        self.item_no_unit.refresh_from_db()

        # Check that the item was updated
        self.assertEqual(self.item_no_unit.quantity, 5)
        self.assertTrue(self.item_no_unit.purchased)

    def test_update_item_add_unit(self):
        """Test updating an item to add a unit (changing from integer to decimal)"""
        url = f'/api/grocerylist/items/{self.item_no_unit.id}/'
        data = {
            'grocery_list': self.grocery_list.id,
            'ingredient': self.ingredient1.id,
            'quantity': 2.5,
            'unit': 'kg'
        }

        response = self.client.put(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

        # Refresh from database
        self.item_no_unit.refresh_from_db()

        # Check that the item was updated with decimal quantity and unit
        self.assertEqual(self.item_no_unit.quantity, Decimal('2.5'))
        self.assertEqual(self.item_no_unit.unit, 'kg')

    def test_delete_grocery_list_item(self):
        """Test deleting a grocery list item"""
        url = f'/api/grocerylist/items/{self.item_no_unit.id}/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, 200)

        # Check that the item was deleted
        with self.assertRaises(GroceryListItem.DoesNotExist):
            GroceryListItem.objects.get(id=self.item_no_unit.id)
