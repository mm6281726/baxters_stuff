from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from grocery_list.models import GroceryList, GroceryListItem
from ingredient.models import Ingredient

User = get_user_model()

class GroceryListModelTest(TestCase):
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
        
        # Create a test ingredient
        self.ingredient = Ingredient.objects.create(
            name='Test Ingredient',
            description='Test Ingredient Description'
        )
    
    def test_grocery_list_creation(self):
        """Test that a grocery list can be created with proper attributes"""
        self.assertEqual(self.grocery_list.title, 'Test Grocery List')
        self.assertEqual(self.grocery_list.description, 'Test Description')
        self.assertEqual(self.grocery_list.user, self.user)
        self.assertFalse(self.grocery_list.completed)
        
    def test_grocery_list_string_representation(self):
        """Test the string representation of a grocery list"""
        self.assertEqual(str(self.grocery_list), 'Test Grocery List')
        
    def test_grocery_list_ordering(self):
        """Test that grocery lists are ordered by created_at in descending order"""
        newer_list = GroceryList.objects.create(
            title='Newer List',
            user=self.user
        )
        lists = GroceryList.objects.all()
        self.assertEqual(lists[0], newer_list)  # Newer list should be first
        self.assertEqual(lists[1], self.grocery_list)
