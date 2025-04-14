from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from pantry.models import PantryItem
from ingredient.models import Ingredient

User = get_user_model()

class PantryItemModelTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )

        # Create a test ingredient
        self.ingredient = Ingredient.objects.create(
            name='Test Ingredient',
            description='Test Ingredient Description'
        )

        # Create a test pantry item with no unit and default stock level
        self.item_no_unit = PantryItem.objects.create(
            user=self.user,
            ingredient=self.ingredient,
            quantity=2,
            notes='Test notes'
            # stock_level will default to 'medium'
        )

        # Create a test pantry item with a unit
        self.item_with_unit = PantryItem.objects.create(
            user=self.user,
            ingredient=self.ingredient,
            quantity=2.5,
            unit='kg',
            notes='Test notes with unit'
            # stock_level will default to 'medium'
        )

        # Create a test pantry item with stock level but no quantity
        self.item_stock_only = PantryItem.objects.create(
            user=self.user,
            ingredient=self.ingredient,
            quantity=None,
            unit=None,
            stock_level='low',
            notes='Test notes with stock level only'
        )

    def test_pantry_item_creation(self):
        """Test that pantry items can be created with proper attributes"""
        # Test item with no unit
        self.assertEqual(self.item_no_unit.user, self.user)
        self.assertEqual(self.item_no_unit.ingredient, self.ingredient)
        self.assertEqual(self.item_no_unit.quantity, 2)
        self.assertIsNone(self.item_no_unit.unit)
        self.assertEqual(self.item_no_unit.stock_level, 'medium')  # Default value
        self.assertEqual(self.item_no_unit.notes, 'Test notes')

        # Test item with unit
        self.assertEqual(self.item_with_unit.user, self.user)
        self.assertEqual(self.item_with_unit.ingredient, self.ingredient)
        self.assertEqual(self.item_with_unit.quantity, Decimal('2.5'))
        self.assertEqual(self.item_with_unit.unit, 'kg')
        self.assertEqual(self.item_with_unit.stock_level, 'medium')  # Default value
        self.assertEqual(self.item_with_unit.notes, 'Test notes with unit')

        # Test item with stock level but no quantity
        self.assertEqual(self.item_stock_only.user, self.user)
        self.assertEqual(self.item_stock_only.ingredient, self.ingredient)
        self.assertIsNone(self.item_stock_only.quantity)
        self.assertIsNone(self.item_stock_only.unit)
        self.assertEqual(self.item_stock_only.stock_level, 'low')  # Explicitly set
        self.assertEqual(self.item_stock_only.notes, 'Test notes with stock level only')

    def test_pantry_item_string_representation(self):
        """Test the string representation of pantry items"""
        self.assertEqual(str(self.item_no_unit), '2  Test Ingredient (Medium)')
        self.assertEqual(str(self.item_with_unit), '2.5 kg Test Ingredient (Medium)')
        self.assertEqual(str(self.item_stock_only), 'Test Ingredient (Low)')

    def test_user_relationship(self):
        """Test the relationship between user and pantry items"""
        items = self.user.pantry_items.all()
        self.assertEqual(items.count(), 3)  # Now we have 3 items
        self.assertIn(self.item_no_unit, items)
        self.assertIn(self.item_with_unit, items)
        self.assertIn(self.item_stock_only, items)
