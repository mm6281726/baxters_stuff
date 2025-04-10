from django.test import TestCase
from django.contrib.auth import get_user_model
from recipe.models import Recipe

User = get_user_model()

class RecipeModelTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        
        # Create a test recipe
        self.recipe = Recipe.objects.create(
            title='Test Recipe',
            description='Test Description',
            prep_time=15,
            cook_time=30,
            servings=4,
            user=self.user
        )
    
    def test_recipe_creation(self):
        """Test that recipes can be created with proper attributes"""
        self.assertEqual(self.recipe.title, 'Test Recipe')
        self.assertEqual(self.recipe.description, 'Test Description')
        self.assertEqual(self.recipe.prep_time, 15)
        self.assertEqual(self.recipe.cook_time, 30)
        self.assertEqual(self.recipe.servings, 4)
        self.assertEqual(self.recipe.user, self.user)
    
    def test_recipe_string_representation(self):
        """Test the string representation of recipes"""
        self.assertEqual(str(self.recipe), 'Test Recipe')
    
    def test_user_relationship(self):
        """Test the relationship between user and recipes"""
        recipes = self.user.recipes.all()
        self.assertEqual(recipes.count(), 1)
        self.assertIn(self.recipe, recipes)
