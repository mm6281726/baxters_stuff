import logging
import re
import time
from typing import Dict, List, Optional, Union
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from django.conf import settings
from ratelimit import limits, sleep_and_retry
from recipe_scrapers import scrape_me, SCRAPERS

from ingredient.models import Ingredient
from ingredient.services import IngredientService
from ..models import Recipe, RecipeItem, RecipeStep

logger = logging.getLogger(__name__)

# Rate limiting configuration
CALLS_PER_MINUTE = 10
ONE_MINUTE = 60

class RecipeScannerService:
    """Service for scanning and extracting recipe data from URLs"""

    @staticmethod
    @sleep_and_retry
    @limits(calls=CALLS_PER_MINUTE, period=ONE_MINUTE)
    def scan_url(url: str, user_id: int) -> Dict:
        """
        Scan a URL for recipe data using a hybrid approach

        Args:
            url: The URL to scan
            user_id: The ID of the user making the request

        Returns:
            Dict containing the extracted recipe data and progress updates
        """
        logger.info(f"Scanning URL: {url}")

        # Initialize progress tracking
        progress = {
            "status": "processing",
            "progress": 0,
            "message": "Starting URL processing..."
        }

        # Validate URL
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            raise ValueError("Invalid URL provided")

        # Try specialized recipe scraper first
        try:
            # Update progress - 20%
            progress["progress"] = 20
            progress["message"] = "Analyzing website content..."

            domain = parsed_url.netloc.lower()
            if any(scraper.lower() in domain for scraper in SCRAPERS.keys()):
                logger.info(f"Using specialized scraper for {domain}")
                return RecipeScannerService._use_specialized_scraper(url, progress)
            else:
                logger.info(f"No specialized scraper for {domain}, using fallback method")
                return RecipeScannerService._use_fallback_scraper(url, progress)
        except Exception as e:
            logger.error(f"Error scanning URL: {str(e)}")
            progress["status"] = "error"
            progress["message"] = f"Error: {str(e)}"
            raise ValueError(f"Failed to extract recipe data: {str(e)}")

    @staticmethod
    def _use_specialized_scraper(url: str, progress: Dict) -> Dict:
        """Use the recipe-scrapers library for supported sites"""
        try:
            # Update progress - 40%
            progress["progress"] = 40
            progress["message"] = "Recognized recipe website, extracting data..."

            scraper = scrape_me(url)

            # Extract basic recipe data
            recipe_data = {
                "title": scraper.title(),
                "description": scraper.description() or "",
                "servings": RecipeScannerService._extract_servings(scraper.yields()),
                "prep_time": None,
                "cook_time": None,
                "ingredients": [],
                "steps": [],
                "progress": progress
            }

            # Try to get prep time and cook time, but don't fail if they're not available
            try:
                recipe_data["prep_time"] = scraper.prep_time() or None
            except Exception:
                pass

            try:
                recipe_data["cook_time"] = scraper.cook_time() or None
            except Exception:
                pass

            # Process ingredients
            try:
                ingredients_list = scraper.ingredients()
                for i, ingredient_text in enumerate(ingredients_list):
                    ingredient_data = RecipeScannerService._parse_ingredient(ingredient_text)
                    recipe_data["ingredients"].append(ingredient_data)
            except Exception as e:
                logger.warning(f"Error extracting ingredients: {str(e)}")

            # Process instructions
            try:
                instructions = scraper.instructions().split('\n')
                for i, step in enumerate(instructions):
                    step = step.strip()
                    if step:  # Skip empty steps
                        recipe_data["steps"].append({
                            "step_number": i + 1,
                            "description": step
                        })
            except Exception as e:
                logger.warning(f"Error extracting instructions: {str(e)}")

            # Update progress - 100%
            progress["progress"] = 100
            progress["message"] = "Recipe processing complete!"
            progress["status"] = "complete"

            return recipe_data
        except Exception as e:
            logger.warning(f"Specialized scraper failed: {str(e)}, falling back to general scraper")
            progress["progress"] = 30
            progress["message"] = "Specialized scraper failed, trying alternative method..."
            return RecipeScannerService._use_fallback_scraper(url, progress)

    @staticmethod
    def _use_fallback_scraper(url: str, progress: Dict) -> Dict:
        """Fallback method using BeautifulSoup for unsupported sites"""
        # Update progress - 40%
        progress["progress"] = 40
        progress["message"] = "Analyzing webpage content..."

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # Update progress - 60%
        progress["progress"] = 60
        progress["message"] = "Extracting recipe content..."

        soup = BeautifulSoup(response.content, 'html.parser')

        # Initialize recipe data
        recipe_data = {
            "title": RecipeScannerService._extract_title(soup),
            "description": RecipeScannerService._extract_description(soup),
            "servings": RecipeScannerService._extract_servings_from_html(soup),
            "prep_time": RecipeScannerService._extract_prep_time(soup),
            "cook_time": RecipeScannerService._extract_cook_time(soup),
            "ingredients": RecipeScannerService._extract_ingredients(soup),
            "steps": RecipeScannerService._extract_steps(soup),
            "progress": progress
        }

        # Update progress - 100%
        progress["progress"] = 100
        progress["message"] = "Recipe processing complete!"
        progress["status"] = "complete"

        return recipe_data

    @staticmethod
    def _extract_title(soup: BeautifulSoup) -> str:
        """Extract recipe title from HTML"""
        # Try schema.org metadata first
        schema_name = soup.find('meta', {'property': 'og:title'})
        if schema_name and schema_name.get('content'):
            return schema_name['content']

        # Try common heading patterns
        for heading in soup.find_all(['h1', 'h2']):
            if heading.text and len(heading.text.strip()) > 3:
                return heading.text.strip()

        # Fallback to page title
        if soup.title:
            return soup.title.string.strip()

        return "Untitled Recipe"

    @staticmethod
    def _extract_description(soup: BeautifulSoup) -> str:
        """Extract recipe description from HTML"""
        # Try meta description
        meta_desc = soup.find('meta', {'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            return meta_desc['content']

        # Try schema.org description
        schema_desc = soup.find('meta', {'property': 'og:description'})
        if schema_desc and schema_desc.get('content'):
            return schema_desc['content']

        # Look for common description containers
        desc_candidates = soup.find_all(['p', 'div'], class_=lambda c: c and any(term in c.lower() for term in ['description', 'summary', 'intro']))
        if desc_candidates:
            return desc_candidates[0].text.strip()

        return ""

    @staticmethod
    def _extract_servings_from_html(soup: BeautifulSoup) -> Optional[int]:
        """Extract servings information from HTML"""
        # Look for common patterns
        serving_patterns = [
            r'serves\s+(\d+)',
            r'servings:\s*(\d+)',
            r'yield[s]?:\s*(\d+)',
            r'for\s+(\d+)\s+people'
        ]

        # Check text content
        for pattern in serving_patterns:
            for element in soup.find_all(['p', 'div', 'span', 'li']):
                text = element.get_text().lower()
                match = re.search(pattern, text)
                if match:
                    try:
                        return int(match.group(1))
                    except ValueError:
                        pass

        return None

    @staticmethod
    def _extract_prep_time(soup: BeautifulSoup) -> Optional[int]:
        """Extract preparation time in minutes from HTML"""
        # Look for common patterns
        time_elements = soup.find_all(['span', 'div', 'p'], class_=lambda c: c and any(term in c.lower() for term in ['prep', 'preparation', 'time']))

        for element in time_elements:
            text = element.get_text().lower()
            # Look for minutes
            minutes_match = re.search(r'(\d+)\s*min', text)
            if minutes_match:
                try:
                    return int(minutes_match.group(1))
                except ValueError:
                    pass

            # Look for hours and convert to minutes
            hours_match = re.search(r'(\d+)\s*h', text)
            if hours_match:
                try:
                    return int(hours_match.group(1)) * 60
                except ValueError:
                    pass

        return None

    @staticmethod
    def _extract_cook_time(soup: BeautifulSoup) -> Optional[int]:
        """Extract cooking time in minutes from HTML"""
        # Look for common patterns
        time_elements = soup.find_all(['span', 'div', 'p'], class_=lambda c: c and any(term in c.lower() for term in ['cook', 'bake', 'time']))

        for element in time_elements:
            text = element.get_text().lower()
            # Look for minutes
            minutes_match = re.search(r'(\d+)\s*min', text)
            if minutes_match:
                try:
                    return int(minutes_match.group(1))
                except ValueError:
                    pass

            # Look for hours and convert to minutes
            hours_match = re.search(r'(\d+)\s*h', text)
            if hours_match:
                try:
                    return int(hours_match.group(1)) * 60
                except ValueError:
                    pass

        return None

    @staticmethod
    def _extract_ingredients(soup: BeautifulSoup) -> List[Dict]:
        """Extract ingredients from HTML"""
        ingredients = []

        # Look for ingredient lists
        ingredient_containers = soup.find_all(['ul', 'ol'], class_=lambda c: c and any(term in c.lower() for term in ['ingredient']))

        if not ingredient_containers:
            # Try to find any list that might contain ingredients
            all_lists = soup.find_all(['ul', 'ol'])
            for list_el in all_lists:
                items = list_el.find_all('li')
                if items and any(RecipeScannerService._looks_like_ingredient(item.text) for item in items):
                    ingredient_containers.append(list_el)

        # Process found containers
        for container in ingredient_containers:
            items = container.find_all('li')
            for item in items:
                text = item.text.strip()
                if text and RecipeScannerService._looks_like_ingredient(text):
                    ingredient_data = RecipeScannerService._parse_ingredient(text)
                    ingredients.append(ingredient_data)

        return ingredients

    @staticmethod
    def _extract_steps(soup: BeautifulSoup) -> List[Dict]:
        """Extract preparation steps from HTML"""
        steps = []

        # Look for instruction lists
        instruction_containers = soup.find_all(['ol', 'div'], class_=lambda c: c and any(term in c.lower() for term in ['instruction', 'direction', 'step', 'method']))

        if instruction_containers:
            # Process ordered lists first
            for container in instruction_containers:
                if container.name == 'ol':
                    items = container.find_all('li')
                    for i, item in enumerate(items):
                        text = item.text.strip()
                        if text:
                            steps.append({
                                "step_number": i + 1,
                                "description": text
                            })
                else:
                    # Process div containers
                    step_elements = container.find_all(['p', 'div'], class_=lambda c: c and any(term in c.lower() for term in ['step', 'instruction']))
                    if step_elements:
                        for i, element in enumerate(step_elements):
                            text = element.text.strip()
                            if text:
                                steps.append({
                                    "step_number": i + 1,
                                    "description": text
                                })

        # If no steps found, try to find paragraphs that might be instructions
        if not steps:
            paragraphs = soup.find_all('p')
            instruction_paragraphs = []

            for p in paragraphs:
                text = p.text.strip()
                # Look for paragraphs that start with numbers or instruction-like words
                if re.match(r'^\d+\.|\bstep\b|\bfirst\b|\bnext\b|\bthen\b', text.lower()):
                    instruction_paragraphs.append(p)

            for i, p in enumerate(instruction_paragraphs):
                steps.append({
                    "step_number": i + 1,
                    "description": p.text.strip()
                })

        return steps

    @staticmethod
    def _looks_like_ingredient(text: str) -> bool:
        """Check if text looks like an ingredient"""
        # Ingredients often contain quantities and units
        quantity_patterns = [
            r'\d+\s*(?:cup|tablespoon|teaspoon|tbsp|tsp|oz|ounce|pound|lb|g|gram|ml|liter|l)',
            r'\d+\s*(?:\/|\.|,)\s*\d+',  # Fractions like 1/2, 1.5
            r'(?:a\s+)?(?:pinch|dash|handful)',
            r'(?:to\s+)?taste'
        ]

        return any(re.search(pattern, text.lower()) for pattern in quantity_patterns)

    @staticmethod
    def _parse_ingredient(text: str) -> Dict:
        """Parse ingredient text into structured data"""
        # Initialize with defaults
        ingredient_data = {
            "name": text.strip(),
            "quantity": 1,
            "unit": None,
            "notes": None
        }

        # Try to extract quantity
        quantity_match = re.search(r'^([\d\s\/\.]+)', text)
        if quantity_match:
            quantity_str = quantity_match.group(1).strip()
            try:
                # Handle fractions
                if '/' in quantity_str:
                    parts = quantity_str.split('/')
                    if len(parts) == 2:
                        ingredient_data["quantity"] = float(parts[0]) / float(parts[1])
                else:
                    ingredient_data["quantity"] = float(quantity_str)

                # Remove quantity from name
                ingredient_data["name"] = text[quantity_match.end():].strip()
            except ValueError:
                pass

        # Try to extract unit
        common_units = ['cup', 'cups', 'tablespoon', 'tablespoons', 'tbsp', 'teaspoon', 'teaspoons', 'tsp',
                        'ounce', 'ounces', 'oz', 'pound', 'pounds', 'lb', 'gram', 'grams', 'g',
                        'kilogram', 'kilograms', 'kg', 'milliliter', 'milliliters', 'ml', 'liter', 'liters', 'l']

        for unit in common_units:
            unit_pattern = r'\b' + unit + r'\b'
            unit_match = re.search(unit_pattern, ingredient_data["name"].lower())
            if unit_match:
                ingredient_data["unit"] = unit
                # Remove unit from name and clean up
                name_parts = re.split(unit_pattern, ingredient_data["name"], flags=re.IGNORECASE, maxsplit=1)
                if len(name_parts) > 1:
                    ingredient_data["name"] = name_parts[1].strip()
                    # Check for "of" after unit
                    if ingredient_data["name"].lower().startswith('of '):
                        ingredient_data["name"] = ingredient_data["name"][3:].strip()
                break

        # Check for notes in parentheses
        notes_match = re.search(r'\((.*?)\)', ingredient_data["name"])
        if notes_match:
            ingredient_data["notes"] = notes_match.group(1).strip()
            # Remove notes from name
            ingredient_data["name"] = re.sub(r'\(.*?\)', '', ingredient_data["name"]).strip()

        # Clean up the name
        ingredient_data["name"] = ingredient_data["name"].strip(',.:;')

        return ingredient_data

    @staticmethod
    def _extract_servings(yields_text: str) -> Optional[int]:
        """Extract servings count from yields text"""
        if not yields_text:
            return None

        # Try to extract a number
        number_match = re.search(r'(\d+)', yields_text)
        if number_match:
            try:
                return int(number_match.group(1))
            except ValueError:
                pass

        return None

    @staticmethod
    def create_recipe_from_scan(scan_data: Dict, user_id: int) -> Dict:
        """
        Create a new recipe from scanned data

        Args:
            scan_data: The scanned recipe data
            user_id: The ID of the user creating the recipe

        Returns:
            Dict containing the created recipe data
        """
        # Create the recipe
        recipe = Recipe.objects.create(
            title=scan_data.get('title', 'Untitled Recipe'),
            description=scan_data.get('description', ''),
            prep_time=scan_data.get('prep_time'),
            cook_time=scan_data.get('cook_time'),
            servings=scan_data.get('servings'),
            user_id=user_id
        )

        # Create recipe items (ingredients)
        for ingredient_data in scan_data.get('ingredients', []):
            # Try to find or create the ingredient
            ingredient_name = ingredient_data.get('name', '').strip()
            if not ingredient_name:
                continue

            # Find or create ingredient
            ingredient = IngredientService.find_or_create_ingredient(
                name=ingredient_name,
                user_id=user_id
            )

            # Create recipe item
            RecipeItem.objects.create(
                recipe=recipe,
                ingredient=ingredient,
                quantity=ingredient_data.get('quantity', 1),
                unit=ingredient_data.get('unit'),
                notes=ingredient_data.get('notes')
            )

        # Create recipe steps
        for step_data in scan_data.get('steps', []):
            RecipeStep.objects.create(
                recipe=recipe,
                step_number=step_data.get('step_number', 1),
                description=step_data.get('description', '')
            )

        # Return the created recipe data
        from ..serializers import RecipeSerializer
        serializer = RecipeSerializer(recipe)
        return serializer.data
