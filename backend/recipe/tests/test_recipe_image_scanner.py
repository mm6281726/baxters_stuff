import os
import unittest
from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image, ImageDraw, ImageFont
import io
import numpy as np

from recipe.services.recipe_image_scanner import RecipeImageScannerService


class RecipeImageScannerServiceTests(TestCase):

    def setUp(self):
        # Create a test image with recipe text
        self.test_image = self._create_test_image()

    def _create_test_image(self):
        """Create a test image with recipe text"""
        # Create a blank image
        img = Image.new('RGB', (800, 1000), color='white')
        draw = ImageDraw.Draw(img)

        # Try to use a default font
        try:
            font = ImageFont.truetype("DejaVuSans.ttf", 20)
        except IOError:
            # Fallback to default
            font = ImageFont.load_default()

        # Add recipe text to the image
        recipe_text = [
            "Chocolate Chip Cookies",
            "",
            "Description: Classic chocolate chip cookies that are soft and chewy.",
            "",
            "Prep Time: 15 minutes",
            "Cook Time: 10 minutes",
            "Servings: 24 cookies",
            "",
            "Ingredients:",
            "2 1/4 cups all-purpose flour",
            "1 tsp baking soda",
            "1 tsp salt",
            "1 cup butter, softened",
            "3/4 cup granulated sugar",
            "3/4 cup brown sugar",
            "2 eggs",
            "2 tsp vanilla extract",
            "2 cups chocolate chips",
            "",
            "Instructions:",
            "1. Preheat oven to 375°F (190°C).",
            "2. Mix flour, baking soda, and salt in a bowl.",
            "3. Cream butter and sugars until fluffy.",
            "4. Beat in eggs and vanilla.",
            "5. Gradually add flour mixture.",
            "6. Stir in chocolate chips.",
            "7. Drop by rounded tablespoons onto baking sheets.",
            "8. Bake for 9 to 11 minutes or until golden brown.",
            "9. Cool on wire racks."
        ]

        y_position = 50
        for line in recipe_text:
            draw.text((50, y_position), line, fill='black', font=font)
            y_position += 30

        # Convert to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)

        # Create a SimpleUploadedFile
        return SimpleUploadedFile(
            "test_recipe.jpg",
            img_byte_arr.getvalue(),
            content_type="image/jpeg"
        )

    @patch('recipe.services.recipe_image_scanner.pytesseract')
    def test_scan_image_success(self, mock_pytesseract):
        """Test successful image scanning"""
        # Mock the OCR result
        mock_pytesseract.image_to_string.return_value = """
        Chocolate Chip Cookies

        Description: Classic chocolate chip cookies that are soft and chewy.

        Prep Time: 15 minutes
        Cook Time: 10 minutes
        Servings: 24 cookies

        Ingredients:
        2 1/4 cups all-purpose flour
        1 tsp baking soda
        1 tsp salt
        1 cup butter, softened
        3/4 cup granulated sugar
        3/4 cup brown sugar
        2 eggs
        2 tsp vanilla extract
        2 cups chocolate chips

        Instructions:
        1. Preheat oven to 375°F (190°C).
        2. Mix flour, baking soda, and salt in a bowl.
        3. Cream butter and sugars until fluffy.
        4. Beat in eggs and vanilla.
        5. Gradually add flour mixture.
        6. Stir in chocolate chips.
        7. Drop by rounded tablespoons onto baking sheets.
        8. Bake for 9 to 11 minutes or until golden brown.
        9. Cool on wire racks.
        """

        # Call the service
        result = RecipeImageScannerService.scan_image(self.test_image)

        # Verify the result
        self.assertEqual(result["title"], "Chocolate Chip Cookies")
        self.assertIn("Classic chocolate chip cookies", result["description"])
        self.assertEqual(result["prep_time"], 15)
        self.assertEqual(result["cook_time"], 10)
        self.assertEqual(result["servings"], 24)

        # Check ingredients
        self.assertGreaterEqual(len(result["ingredients"]), 5)
        flour_found = False
        for ingredient in result["ingredients"]:
            if "flour" in ingredient["name"].lower():
                flour_found = True
                self.assertEqual(ingredient["quantity"], 2.25)
                self.assertEqual(ingredient["unit"], "cups")
        self.assertTrue(flour_found, "Flour ingredient not found")

        # Check steps
        self.assertGreaterEqual(len(result["steps"]), 5)
        preheat_found = False
        for step in result["steps"]:
            if "preheat" in step["description"].lower():
                preheat_found = True
                self.assertEqual(step["step_number"], 1)
        self.assertTrue(preheat_found, "Preheat step not found")

    @patch('recipe.services.recipe_image_scanner.pytesseract')
    def test_scan_image_insufficient_text(self, mock_pytesseract):
        """Test image with insufficient text"""
        # Mock the OCR result with insufficient text
        mock_pytesseract.image_to_string.return_value = "Just a few words"

        # Call the service and expect an exception
        with self.assertRaises(ValueError) as context:
            RecipeImageScannerService.scan_image(self.test_image)

        self.assertIn("Could not extract sufficient text", str(context.exception))

    def test_extract_time_value(self):
        """Test extracting time values from text"""
        # Test minutes only
        self.assertEqual(RecipeImageScannerService._extract_time_value("15 minutes"), 15)

        # Test hours only
        self.assertEqual(RecipeImageScannerService._extract_time_value("2 hours"), 120)

        # Test hours and minutes
        self.assertEqual(RecipeImageScannerService._extract_time_value("1 hour 30 minutes"), 90)

        # Test with text around it
        self.assertEqual(RecipeImageScannerService._extract_time_value("Prep Time: 25 minutes total"), 25)

        # Test with no time
        self.assertIsNone(RecipeImageScannerService._extract_time_value("No time mentioned"))

    def test_extract_servings(self):
        """Test extracting servings from text"""
        # Test simple servings
        self.assertEqual(RecipeImageScannerService._extract_servings("Serves 4"), 4)

        # Test with word 'servings'
        self.assertEqual(RecipeImageScannerService._extract_servings("8 servings"), 8)

        # Test with text around it
        self.assertEqual(RecipeImageScannerService._extract_servings("Yield: 12 cookies"), 12)

        # Test with no servings
        self.assertIsNone(RecipeImageScannerService._extract_servings("No servings mentioned"))

    def test_parse_ingredients(self):
        """Test parsing ingredient lines"""
        ingredient_lines = [
            "2 cups flour",
            "1/2 tsp salt",
            "3 tbsp butter, softened",
            "1 cup sugar (granulated)"
        ]

        result = RecipeImageScannerService._parse_ingredients(ingredient_lines)

        # Check number of ingredients
        self.assertEqual(len(result), 4)

        # Check first ingredient
        self.assertEqual(result[0]["name"], "flour")
        self.assertEqual(result[0]["quantity"], 2)
        self.assertEqual(result[0]["unit"], "cups")

        # Check fractional quantity
        self.assertEqual(result[1]["name"], "salt")
        self.assertEqual(result[1]["quantity"], 0.5)
        self.assertEqual(result[1]["unit"], "tsp")

        # Check ingredient with notes
        self.assertEqual(result[2]["name"], "butter")
        self.assertEqual(result[2]["notes"], "softened")

        # Check ingredient with parenthetical notes
        self.assertEqual(result[3]["name"], "sugar")
        self.assertEqual(result[3]["notes"], "granulated")

    def test_parse_instructions(self):
        """Test parsing instruction lines"""
        instruction_lines = [
            "1. Preheat oven to 350°F.",
            "2. Mix dry ingredients.",
            "3. Add wet ingredients and stir.",
            "4. Bake for 30 minutes."
        ]

        result = RecipeImageScannerService._parse_instructions(instruction_lines)

        # Check number of steps
        self.assertEqual(len(result), 4)

        # Check step numbers and descriptions
        self.assertEqual(result[0]["step_number"], 1)
        self.assertEqual(result[0]["description"], "Preheat oven to 350°F.")

        self.assertEqual(result[1]["step_number"], 2)
        self.assertEqual(result[1]["description"], "Mix dry ingredients.")

        self.assertEqual(result[2]["step_number"], 3)
        self.assertEqual(result[2]["description"], "Add wet ingredients and stir.")

        self.assertEqual(result[3]["step_number"], 4)
        self.assertEqual(result[3]["description"], "Bake for 30 minutes.")

    def tearDown(self):
        # Clean up any temporary files
        pass


if __name__ == '__main__':
    unittest.main()
