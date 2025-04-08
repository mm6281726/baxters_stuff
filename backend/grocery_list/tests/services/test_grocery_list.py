from django.test import TestCase

from grocery_list.models import GroceryList
from grocery_list.services import GroceryListService

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
        # We're not testing the specific ID because it might change
        # Just check that we have the right number of lists
        self.assertEqual(len(grocery_lists), 2)
        # Check that the lists have the expected titles
        titles = [gl['title'] for gl in grocery_lists]
        self.assertIn("Test Title", titles)
        self.assertIn("Test Title 2", titles)

    def test_get(self):
        """
        Test get() function returns JSON formatted GroceryList
        """
        # Get the first grocery list from the database
        first_list = GroceryList.objects.first()
        id = first_list.id
        title = first_list.title
        grocery_list = GroceryListService.get(id=id)
        self.assertEqual(grocery_list['id'], id)
        self.assertEqual(grocery_list['title'], title)

    def test_create(self):
        """
        Test create() function returns a new JSON formatted GroceryList
        """
        title = 'Test Title 3'
        description = 'Test Description'
        validated_data = {}
        validated_data['title'] = title
        validated_data['description'] = description
        grocery_list = GroceryListService.create(validated_data)
        self.assertEqual(grocery_list['title'], title)
        self.assertEqual(grocery_list['description'], description)
        # Check that we now have 3 grocery lists
        self.assertEqual(GroceryList.objects.count(), 3)

    def test_create_no_description(self):
        """
        Test create() function returns a new JSON formatted GroceryList
        """
        title = 'Test Title 4'
        description = ''
        validated_data = {}
        validated_data['title'] = title
        validated_data['description'] = description
        grocery_list = GroceryListService.create(validated_data)
        self.assertEqual(grocery_list['title'], title)
        self.assertEqual(grocery_list['description'], description)
        # Check that we now have 3 grocery lists
        self.assertEqual(GroceryList.objects.count(), 3)

    def test_update(self):
        """
        Test update() function returns an updated JSON formatted GroceryList
        """
        # Get the first grocery list from the database
        first_list = GroceryList.objects.first()
        id = first_list.id
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
        # Get the first grocery list from the database
        first_list = GroceryList.objects.first()
        id = first_list.id
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
        # Get the second grocery list from the database
        second_list = GroceryList.objects.all()[1]
        id = second_list.id
        GroceryListService.delete(id=id)
        self.assertEqual(GroceryList.objects.count(), 1)
