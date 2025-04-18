from django.test import TestCase

from ...models import IngredientCategory
from ...services import IngredientCategoryService


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
        self.assertEqual(categories[0]['id'], 1)

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

    def test_create_blank_description(self):
        """
        Test create() function with blank description
        """
        name = 'Test Category Blank Description'
        description = ''
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        category = IngredientCategoryService.create(validated_data)
        self.assertEqual(category['name'], name)
        self.assertEqual(category['description'], description)

    def test_create_null_description(self):
        """
        Test create() function with null description
        """
        name = 'Test Category Null Description'
        validated_data = {}
        validated_data['name'] = name
        # Don't include description field at all
        category = IngredientCategoryService.create(validated_data)
        self.assertEqual(category['name'], name)
        self.assertIsNone(category['description'])

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

    def test_update_blank_description(self):
        """
        Test update() function with blank description
        """
        id = 1
        name = "Updated With Blank Description"
        description = ""
        validated_data = {}
        validated_data['name'] = name
        validated_data['description'] = description
        category = IngredientCategoryService.update(id, validated_data)
        self.assertEqual(category['id'], id)
        self.assertEqual(category['name'], name)
        self.assertEqual(category['description'], description)

    def test_update_null_description(self):
        """
        Test update() function with null description
        """
        id = 1
        name = "Updated With Null Description"
        validated_data = {}
        validated_data['name'] = name
        # Don't include description field
        category = IngredientCategoryService.update(id, validated_data)
        self.assertEqual(category['id'], id)
        self.assertEqual(category['name'], name)
        # The existing description should remain unchanged since we didn't include it in the update

    def test_delete(self):
        """
        Test delete() function deletes an updated JSON formatted IngredientCategory
        """
        id = 2
        IngredientCategoryService.delete(id=id)
        self.assertEqual(IngredientCategory.objects.count(), 1)
