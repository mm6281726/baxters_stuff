from django.test import TestCase

from .models import Ingredient
from .services import IngredientService

class IngredientServiceTests(TestCase):
    def setUp(self):
        Ingredient.objects.create(name="Test Name", description="Test Description",)
        Ingredient.objects.create(name="Test Name 2", description="Test Description 2",)
    
    def test_list(self):
        """
        Test list() function returns JSON formatted list of Ingredients
        """
        grocery_lists = IngredientService.list()
        self.assertIsNotNone(grocery_lists)
        self.assertEquals(grocery_lists[0]['id'], 1)

    def test_get(self):
        """
        Test get() function returns JSON formatted Ingredient
        """
        id = 1
        name = "Test name"
        grocery_list = IngredientService.get(id=id)
        self.assertEqual(grocery_list['id'], id)
        self.assertEqual(grocery_list['name'], name)

    def test_create(self):
        """
        Test create() function returns a new JSON formatted Ingredient
        """
        name = 'Test name 2'
        description = 'Test Description'
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        grocery_list = IngredientService.create(validated_data)
        self.assertEqual(grocery_list['id'], 3)
        self.assertEqual(grocery_list['name'], name)
        self.assertEqual(grocery_list['description'], description)

    def test_update(self):
        """
        Test update() function returns an updated JSON formatted Ingredient
        """
        id = 1
        name = "Updated name"
        description = "Updated Description"
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        grocery_list = IngredientService.update(id, validated_data)
        self.assertEqual(grocery_list['id'], id)
        self.assertEqual(grocery_list['name'], name)
        self.assertEqual(grocery_list['description'], description)

    def test_delete(self):
        """
        Test delete() function deletes an updated JSON formatted Ingredient
        """
        id = 2
        IngredientService.delete(id=id)
        self.assertEqual(Ingredient.objects.count(), 1)