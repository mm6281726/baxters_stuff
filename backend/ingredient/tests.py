from django.test import TestCase

from .models import Ingredient
from .models import IngredientCategory
from .services import IngredientService
from .services import IngredientCategoryService

class IngredientServiceTests(TestCase):
    def setUp(self):        
        Ingredient.objects.create(name="Test Name", description="Test Description",)
        Ingredient.objects.create(name="Test Name 2", description="Test Description 2",)
        IngredientCategory.objects.create(name="Test Name", description="Test Description",)
    
    def test_list(self):
        """
        Test list() function returns JSON formatted list of Ingredients
        """
        ingredients = IngredientService.list()
        self.assertIsNotNone(ingredients)
        self.assertEquals(ingredients[0]['id'], 1)

    def test_get(self):
        """
        Test get() function returns JSON formatted Ingredient
        """
        id = 1
        name = "Test Name"
        ingredient = IngredientService.get(id=id)
        self.assertEqual(ingredient['id'], id)
        self.assertEqual(ingredient['name'], name)

    def test_create(self):
        """
        Test create() function returns a new JSON formatted Ingredient
        """
        name = 'Test Name 2'
        description = 'Test Description'
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        validated_data['categories'] = []
        ingredient = IngredientService.create(validated_data)
        self.assertEqual(ingredient['id'], 3)
        self.assertEqual(ingredient['name'], name)
        self.assertEqual(ingredient['description'], description)
        self.assertEqual(len(ingredient['categories']), 0)

    def test_create_no_description(self):
        """
        Test create() function returns a new JSON formatted Ingredient
        """
        name = 'Test Name 2'
        description = ''
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        validated_data['categories'] = []
        ingredient = IngredientService.create(validated_data)
        self.assertEqual(ingredient['id'], 3)
        self.assertEqual(ingredient['name'], name)
        self.assertEqual(ingredient['description'], description)
        self.assertEqual(len(ingredient['categories']), 0)

    def test_update(self):
        """
        Test update() function returns an updated JSON formatted Ingredient
        """
        id = 1
        name = "Updated Name"
        description = "Updated Description"
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        validated_data['categories'] = []
        ingredient = IngredientService.update(id, validated_data)
        self.assertEqual(ingredient['id'], id)
        self.assertEqual(ingredient['name'], name)
        self.assertEqual(ingredient['description'], description)
        self.assertEqual(len(ingredient['categories']), 0)

    def test_update_no_description(self):
        """
        Test update() function returns an updated JSON formatted Ingredient
        """
        id = 1
        name = "Updated Name"
        description = ""
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        validated_data['categories'] = []
        ingredient = IngredientService.update(id, validated_data)
        self.assertEqual(ingredient['id'], id)
        self.assertEqual(ingredient['name'], name)
        self.assertEqual(ingredient['description'], description)
        self.assertEqual(len(ingredient['categories']), 0)

    def test_update_add_category(self):
        """
        Test update() function returns an updated JSON formatted Ingredient with added category
        """
        id = 1
        name = "Updated Name 2"
        description = "Updated Description 2"
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        validated_data['categories'] = [1]
        ingredient = IngredientService.update(id, validated_data)
        self.assertEqual(ingredient['id'], id)
        self.assertEqual(ingredient['name'], name)
        self.assertEqual(ingredient['description'], description)
        self.assertEqual(len(ingredient['categories']), 1)

    def test_update_remove_category(self):
        """
        Test update() function returns an updated JSON formatted Ingredient with category removed
        """
        id = 1
        name = "Updated Name 3"
        description = "Updated Description 3"
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        validated_data['categories'] = [1]
        ingredient = IngredientService.update(id, validated_data)

        self.assertEqual(ingredient['id'], id)
        self.assertEqual(ingredient['name'], name)
        self.assertEqual(ingredient['description'], description)
        self.assertEqual(len(ingredient['categories']), 1)

        validated_data['categories'] = []
        ingredient = IngredientService.update(id, validated_data)

        self.assertEqual(ingredient['id'], id)
        self.assertEqual(ingredient['name'], name)
        self.assertEqual(ingredient['description'], description)
        self.assertEqual(len(ingredient['categories']), 0)

    def test_delete(self):
        """
        Test delete() function deletes an updated JSON formatted Ingredient
        """
        id = 2
        IngredientService.delete(id=id)
        self.assertEqual(Ingredient.objects.count(), 1)


class IngredientCategoryServiceTests(TestCase):
    def setUp(self):
        IngredientCategory.objects.create(name="Test Name", description="Test Description",)
        IngredientCategory.objects.create(name="Test Name 2", description="Test Description 2",)
    
    def test_list(self):
        """
        Test list() function returns JSON formatted list of IngredientCategorys
        """
        categories = IngredientCategoryService.list()
        self.assertIsNotNone(categories)
        self.assertEquals(categories[0]['id'], 1)

    def test_get(self):
        """
        Test get() function returns JSON formatted IngredientCategory
        """
        id = 1
        name = "Test Name"
        category = IngredientCategoryService.get(id=id)
        self.assertEqual(category['id'], id)
        self.assertEqual(category['name'], name)

    def test_create(self):
        """
        Test create() function returns a new JSON formatted IngredientCategory
        """
        name = 'Test Name 2'
        description = 'Test Description'
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        category = IngredientCategoryService.create(validated_data)
        self.assertEqual(category['id'], 3)
        self.assertEqual(category['name'], name)
        self.assertEqual(category['description'], description)

    def test_update(self):
        """
        Test update() function returns an updated JSON formatted IngredientCategory
        """
        id = 1
        name = "Updated Name"
        description = "Updated Description"
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        category = IngredientCategoryService.update(id, validated_data)
        self.assertEqual(category['id'], id)
        self.assertEqual(category['name'], name)
        self.assertEqual(category['description'], description)

    def test_delete(self):
        """
        Test delete() function deletes an updated JSON formatted IngredientCategory
        """
        id = 2
        IngredientCategoryService.delete(id=id)
        self.assertEqual(IngredientCategory.objects.count(), 1)