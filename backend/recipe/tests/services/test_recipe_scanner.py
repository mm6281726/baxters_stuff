from django.test import TestCase
from unittest.mock import patch, MagicMock

from django.contrib.auth import get_user_model
from ingredient.models import Ingredient
from ...models import Recipe
from ...services import RecipeScannerService

User = get_user_model()

class RecipeScannerServiceTests(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        
        # Create test ingredients
        self.ingredient1 = Ingredient.objects.create(name="Salt")
        self.ingredient2 = Ingredient.objects.create(name="Pepper")
    
    @patch('recipe.services.recipe_scanner.requests.get')
    @patch('recipe.services.recipe_scanner.scrape_me')
    def test_scan_url_specialized_scraper(self, mock_scrape_me, mock_requests_get):
        """Test scanning a URL with a specialized scraper"""
        # Mock the scraper response
        mock_scraper = MagicMock()
        mock_scraper.title.return_value = "Test Recipe"
        mock_scraper.description.return_value = "A test recipe description"
        mock_scraper.yields.return_value = "4 servings"
        mock_scraper.prep_time.return_value = 15
        mock_scraper.cook_time.return_value = 30
        mock_scraper.ingredients.return_value = ["1 tsp salt", "1/2 tsp pepper"]
        mock_scraper.instructions.return_value = "Step 1: Mix ingredients.\nStep 2: Cook."
        
        mock_scrape_me.return_value = mock_scraper
        
        # Test the scan_url method
        with patch('recipe.services.recipe_scanner.SCRAPERS', {'example.com': 'ExampleScraper'}):
            result = RecipeScannerService.scan_url('https://example.com/recipe', self.user.id)
        
        # Verify the result
        self.assertEqual(result['title'], "Test Recipe")
        self.assertEqual(result['description'], "A test recipe description")
        self.assertEqual(result['servings'], 4)
        self.assertEqual(result['prep_time'], 15)
        self.assertEqual(result['cook_time'], 30)
        self.assertEqual(len(result['ingredients']), 2)
        self.assertEqual(len(result['steps']), 2)
    
    @patch('recipe.services.recipe_scanner.requests.get')
    @patch('recipe.services.recipe_scanner.BeautifulSoup')
    def test_scan_url_fallback_scraper(self, mock_bs, mock_requests_get):
        """Test scanning a URL with the fallback scraper"""
        # Mock the requests response
        mock_response = MagicMock()
        mock_response.content = "<html><body>Recipe content</body></html>"
        mock_requests_get.return_value = mock_response
        
        # Mock BeautifulSoup
        mock_soup = MagicMock()
        mock_title = MagicMock()
        mock_title.__getitem__.return_value = "Test Fallback Recipe"
        mock_soup.find.return_value = mock_title
        mock_soup.find_all.return_value = []
        mock_bs.return_value = mock_soup
        
        # Mock the extraction methods
        with patch.object(RecipeScannerService, '_extract_title', return_value="Test Fallback Recipe"), \
             patch.object(RecipeScannerService, '_extract_description', return_value="A fallback description"), \
             patch.object(RecipeScannerService, '_extract_servings_from_html', return_value=2), \
             patch.object(RecipeScannerService, '_extract_prep_time', return_value=10), \
             patch.object(RecipeScannerService, '_extract_cook_time', return_value=20), \
             patch.object(RecipeScannerService, '_extract_ingredients', return_value=[
                 {"name": "Salt", "quantity": 1, "unit": "tsp", "notes": None}
             ]), \
             patch.object(RecipeScannerService, '_extract_steps', return_value=[
                 {"step_number": 1, "description": "Mix ingredients."}
             ]):
            
            result = RecipeScannerService.scan_url('https://unknown.com/recipe', self.user.id)
        
        # Verify the result
        self.assertEqual(result['title'], "Test Fallback Recipe")
        self.assertEqual(result['description'], "A fallback description")
        self.assertEqual(result['servings'], 2)
        self.assertEqual(result['prep_time'], 10)
        self.assertEqual(result['cook_time'], 20)
        self.assertEqual(len(result['ingredients']), 1)
        self.assertEqual(len(result['steps']), 1)
    
    def test_parse_ingredient(self):
        """Test parsing ingredient text"""
        # Test with quantity, unit and name
        result = RecipeScannerService._parse_ingredient("2 cups flour")
        self.assertEqual(result['quantity'], 2)
        self.assertEqual(result['unit'], "cups")
        self.assertEqual(result['name'], "flour")
        
        # Test with fraction
        result = RecipeScannerService._parse_ingredient("1/2 tsp salt")
        self.assertEqual(result['quantity'], 0.5)
        self.assertEqual(result['unit'], "tsp")
        self.assertEqual(result['name'], "salt")
        
        # Test with notes in parentheses
        result = RecipeScannerService._parse_ingredient("1 onion (diced)")
        self.assertEqual(result['quantity'], 1)
        self.assertEqual(result['unit'], None)
        self.assertEqual(result['name'], "onion")
        self.assertEqual(result['notes'], "diced")
    
    @patch('ingredient.services.IngredientService.find_or_create_ingredient')
    def test_create_recipe_from_scan(self, mock_find_or_create):
        """Test creating a recipe from scanned data"""
        # Mock the find_or_create_ingredient method
        mock_find_or_create.side_effect = [self.ingredient1, self.ingredient2]
        
        # Create test scan data
        scan_data = {
            'title': 'Test Recipe',
            'description': 'A test recipe',
            'prep_time': 15,
            'cook_time': 30,
            'servings': 4,
            'ingredients': [
                {'name': 'Salt', 'quantity': 1, 'unit': 'tsp', 'notes': None},
                {'name': 'Pepper', 'quantity': 0.5, 'unit': 'tsp', 'notes': 'freshly ground'}
            ],
            'steps': [
                {'step_number': 1, 'description': 'Mix salt and pepper.'},
                {'step_number': 2, 'description': 'Serve.'}
            ]
        }
        
        # Test creating a recipe
        result = RecipeScannerService.create_recipe_from_scan(scan_data, self.user.id)
        
        # Verify the result
        self.assertIsNotNone(result)
        self.assertEqual(result['title'], 'Test Recipe')
        
        # Verify the recipe was created in the database
        recipe = Recipe.objects.get(id=result['id'])
        self.assertEqual(recipe.title, 'Test Recipe')
        self.assertEqual(recipe.description, 'A test recipe')
        self.assertEqual(recipe.prep_time, 15)
        self.assertEqual(recipe.cook_time, 30)
        self.assertEqual(recipe.servings, 4)
        self.assertEqual(recipe.user_id, self.user.id)
        
        # Verify recipe items were created
        self.assertEqual(recipe.items.count(), 2)
        
        # Verify recipe steps were created
        self.assertEqual(recipe.steps.count(), 2)
        self.assertEqual(recipe.steps.first().description, 'Mix salt and pepper.')
