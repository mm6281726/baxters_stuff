from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from grocery_list.models import GroceryList, GroceryListItem
from ingredient.models import Ingredient

User = get_user_model()

class GroceryListItemModelTest(TestCase):
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
        
        # Create a test ingredient
        self.ingredient = Ingredient.objects.create(
            name='Test Ingredient',
            description='Test Ingredient Description'
        )
        
        # Create a test grocery list item with no unit
        self.item_no_unit = GroceryListItem.objects.create(
            grocery_list=self.grocery_list,
            ingredient=self.ingredient,
            quantity=2,
            notes='Test notes'
        )
        
        # Create a test grocery list item with a unit
        self.item_with_unit = GroceryListItem.objects.create(
            grocery_list=self.grocery_list,
            ingredient=self.ingredient,
            quantity=2.5,
            unit='kg',
            notes='Test notes with unit'
        )
    
    def test_grocery_list_item_creation(self):
        """Test that grocery list items can be created with proper attributes"""
        # Test item with no unit
        self.assertEqual(self.item_no_unit.grocery_list, self.grocery_list)
        self.assertEqual(self.item_no_unit.ingredient, self.ingredient)
        self.assertEqual(self.item_no_unit.quantity, 2)
        self.assertIsNone(self.item_no_unit.unit)
        self.assertEqual(self.item_no_unit.notes, 'Test notes')
        self.assertFalse(self.item_no_unit.purchased)
        
        # Test item with unit
        self.assertEqual(self.item_with_unit.grocery_list, self.grocery_list)
        self.assertEqual(self.item_with_unit.ingredient, self.ingredient)
        self.assertEqual(self.item_with_unit.quantity, Decimal('2.5'))
        self.assertEqual(self.item_with_unit.unit, 'kg')
        self.assertEqual(self.item_with_unit.notes, 'Test notes with unit')
        self.assertFalse(self.item_with_unit.purchased)
    
    def test_grocery_list_item_string_representation(self):
        """Test the string representation of grocery list items"""
        self.assertEqual(str(self.item_no_unit), '2  Test Ingredient')
        self.assertEqual(str(self.item_with_unit), '2.5 kg Test Ingredient')
    
    def test_grocery_list_relationship(self):
        """Test the relationship between grocery list and items"""
        items = self.grocery_list.items.all()
        self.assertEqual(items.count(), 2)
        self.assertIn(self.item_no_unit, items)
        self.assertIn(self.item_with_unit, items)
