from django.test import TestCase

from .models import GroceryList
from .services import GroceryListService

class GroceryListServiceTests(TestCase):
    def setUp(self):
        GroceryList.objects.create(title="Test Title", description="Test Description", completed=False)
        GroceryList.objects.create(title="Test Title 2", description="Test Description 2", completed=True)
    
    def test_list(self):
        """
        Test list() function returns JSON formatted list of GroceryLists
        """
        grocery_lists = GroceryListService.list()
        self.assertIsNotNone(grocery_lists)
        self.assertEquals(grocery_lists[0]['id'], 1)

    def test_get(self):
        """
        Test get() function returns JSON formatted GroceryList
        """
        id = 1
        title = "Test Title"
        grocery_list = GroceryListService.get(id=id)
        self.assertEqual(grocery_list['id'], id)
        self.assertEqual(grocery_list['title'], title)

    def test_create(self):
        """
        Test create() function returns a new JSON formatted GroceryList
        """
        title = 'Test Title 2'
        description = 'Test Description'
        validated_data = {}
        validated_data['title'] = title
        validated_data['description'] = description
        grocery_list = GroceryListService.create(validated_data)
        self.assertEqual(grocery_list['id'], 3)
        self.assertEqual(grocery_list['title'], title)
        self.assertEqual(grocery_list['description'], description)

    def test_create_no_description(self):
        """
        Test create() function returns a new JSON formatted GroceryList
        """
        title = 'Test Title 2'
        description = ''
        validated_data = {}
        validated_data['title'] = title
        validated_data['description'] = description
        grocery_list = GroceryListService.create(validated_data)
        self.assertEqual(grocery_list['id'], 3)
        self.assertEqual(grocery_list['title'], title)
        self.assertEqual(grocery_list['description'], description)

    def test_update(self):
        """
        Test update() function returns an updated JSON formatted GroceryList
        """
        id = 1
        title = "Updated Title"
        description = "Updated Description"
        validated_data = {}
        validated_data['title'] = title
        validated_data['description'] = description
        grocery_list = GroceryListService.update(id, validated_data)
        self.assertEqual(grocery_list['id'], id)
        self.assertEqual(grocery_list['title'], title)
        self.assertEqual(grocery_list['description'], description)

    def test_update_no_description(self):
        """
        Test update() function returns an updated JSON formatted GroceryList
        """
        id = 1
        title = "Updated Title"
        description = ""
        validated_data = {}
        validated_data['title'] = title
        validated_data['description'] = description
        grocery_list = GroceryListService.update(id, validated_data)
        self.assertEqual(grocery_list['id'], id)
        self.assertEqual(grocery_list['title'], title)
        self.assertEqual(grocery_list['description'], description)

    def test_delete(self):
        """
        Test delete() function deletes an updated JSON formatted GroceryList
        """
        id = 2
        GroceryListService.delete(id=id)
        self.assertEqual(GroceryList.objects.count(), 1)