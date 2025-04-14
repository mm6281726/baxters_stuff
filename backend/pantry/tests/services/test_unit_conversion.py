from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model

from pantry.models import PantryItem
from pantry.services.unit_conversion import PantryUnitConversionService
from grocery_list.models import GroceryList, GroceryListItem
from ingredient.models import Ingredient

User = get_user_model()

class PantryUnitConversionServiceTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )

        # Create test ingredients
        self.flour = Ingredient.objects.create(
            name='Flour',
            description='All-purpose flour'
        )

        self.water = Ingredient.objects.create(
            name='Water',
            description='Plain water'
        )

        # Create test pantry items
        self.flour_pantry_item = PantryItem.objects.create(
            user=self.user,
            ingredient=self.flour,
            quantity=500,
            unit='g',
            stock_level='medium'
        )

        self.water_pantry_item = PantryItem.objects.create(
            user=self.user,
            ingredient=self.water,
            quantity=1,
            unit='l',
            stock_level='high'
        )

        # Create a test grocery list
        self.grocery_list = GroceryList.objects.create(
            user=self.user,
            title='Test Grocery List'
        )

        # Create test grocery list items
        self.flour_grocery_item = GroceryListItem.objects.create(
            grocery_list=self.grocery_list,
            ingredient=self.flour,
            quantity=2,
            unit='kg'
        )

        self.water_grocery_item = GroceryListItem.objects.create(
            grocery_list=self.grocery_list,
            ingredient=self.water,
            quantity=500,
            unit='ml'
        )

    def test_convert_pantry_item_units(self):
        """Test converting a pantry item's units"""
        # Convert flour from g to kg
        result = PantryUnitConversionService.convert_pantry_item_units(
            pantry_item_id=self.flour_pantry_item.id,
            to_unit='kg'
        )

        # Check the result
        self.assertEqual(result['id'], self.flour_pantry_item.id)
        self.assertEqual(result['unit'], 'kg')
        self.assertEqual(result['quantity'], 0.5)  # 500g = 0.5kg
        self.assertTrue(result['converted'])

        # Refresh the pantry item from the database
        self.flour_pantry_item.refresh_from_db()
        self.assertEqual(self.flour_pantry_item.unit, 'kg')
        self.assertEqual(float(self.flour_pantry_item.quantity), 0.5)

    def test_convert_grocery_to_pantry(self):
        """Test converting a grocery item to a pantry item"""
        # Convert flour grocery item to pantry with explicit unit conversion to kg
        result = PantryUnitConversionService.convert_grocery_to_pantry(
            grocery_item_id=self.flour_grocery_item.id,
            user_id=self.user.id,
            to_unit='kg'
        )

        # Check the result - should add to existing pantry item
        self.assertEqual(result['id'], self.flour_pantry_item.id)

        # Refresh the pantry item from the database
        self.flour_pantry_item.refresh_from_db()

        # 500g (original) converted to kg = 0.5kg + 2kg (new) = 2.5kg
        self.assertEqual(self.flour_pantry_item.unit, 'kg')
        self.assertEqual(float(self.flour_pantry_item.quantity), 2.5)

        # Convert water grocery item to pantry with unit conversion
        result = PantryUnitConversionService.convert_grocery_to_pantry(
            grocery_item_id=self.water_grocery_item.id,
            user_id=self.user.id,
            to_unit='l'
        )

        # Check the result - should add to existing pantry item
        self.assertEqual(result['id'], self.water_pantry_item.id)

        # Refresh the pantry item from the database
        self.water_pantry_item.refresh_from_db()

        # 1l (original) + 500ml (converted to l = 0.5l) = 1.5l
        self.assertEqual(self.water_pantry_item.unit, 'l')
        self.assertEqual(float(self.water_pantry_item.quantity), 1.5)

    def test_convert_grocery_to_new_pantry(self):
        """Test converting a grocery item to a new pantry item"""
        # Create a new grocery item for an ingredient not in pantry
        sugar = Ingredient.objects.create(
            name='Sugar',
            description='Granulated sugar'
        )

        sugar_grocery_item = GroceryListItem.objects.create(
            grocery_list=self.grocery_list,
            ingredient=sugar,
            quantity=500,
            unit='g'
        )

        # Convert sugar grocery item to pantry
        result = PantryUnitConversionService.convert_grocery_to_pantry(
            grocery_item_id=sugar_grocery_item.id,
            user_id=self.user.id
        )

        # Check the result - should create a new pantry item
        self.assertNotEqual(result['id'], self.flour_pantry_item.id)
        self.assertNotEqual(result['id'], self.water_pantry_item.id)

        # Get the new pantry item from the database
        sugar_pantry_item = PantryItem.objects.get(id=result['id'])

        # Check the new pantry item
        self.assertEqual(sugar_pantry_item.ingredient, sugar)
        self.assertEqual(sugar_pantry_item.unit, 'g')
        self.assertEqual(float(sugar_pantry_item.quantity), 500)
        self.assertEqual(sugar_pantry_item.stock_level, 'high')  # New items start at high
