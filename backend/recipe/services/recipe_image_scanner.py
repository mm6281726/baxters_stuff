import cv2
import numpy as np
import pytesseract
import re
import logging
import os
import tempfile
import nltk
from PIL import Image
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# Download necessary NLTK data (only needs to be done once)
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('taggers/averaged_perceptron_tagger')
    logger.info("NLTK data loaded successfully")
except LookupError:
    nltk.download('punkt')
    nltk.download('averaged_perceptron_tagger')
    logger.info("Downloaded NLTK data successfully")

# Create a custom sentence tokenizer using punkt directly
def custom_sent_tokenize(text):
    try:
        # Try to use NLTK's sent_tokenize
        return nltk.sent_tokenize(text)
    except Exception as e:
        logger.warning(f"NLTK sent_tokenize failed: {str(e)}. Using fallback method.")
        # Fallback to simple regex-based sentence splitting
        return [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]

class RecipeImageScannerService:
    """Service for scanning and extracting recipe data from images"""

    @staticmethod
    def scan_image(image_file) -> Dict:
        """
        Extract recipe data from an uploaded image using OCR and rule-based parsing

        Args:
            image_file: The uploaded image file

        Returns:
            Dict containing the extracted recipe data and progress updates
        """
        logger.info("Processing uploaded recipe image")

        try:
            # Initialize progress tracking
            progress = {
                "status": "processing",
                "progress": 0,
                "message": "Starting image processing..."
            }

            # Save the uploaded image temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                temp_path = temp_file.name
                for chunk in image_file.chunks():
                    temp_file.write(chunk)

            # Update progress - 20%
            progress["progress"] = 20
            progress["message"] = "Image uploaded, preprocessing..."

            # Open the image with PIL
            img = Image.open(temp_path)

            # Preprocess the image for better OCR results
            img = RecipeImageScannerService._preprocess_image(img)

            # Update progress - 40%
            progress["progress"] = 40
            progress["message"] = "Image preprocessed, performing OCR..."

            # Perform OCR on the image
            extracted_text = pytesseract.image_to_string(img)

            # Clean up the temporary file
            os.unlink(temp_path)

            # Update progress - 60%
            progress["progress"] = 60
            progress["message"] = "Text extracted, analyzing content..."

            if not extracted_text or len(extracted_text) < 50:
                raise ValueError("Could not extract sufficient text from the image")

            # Update progress - 80%
            progress["progress"] = 80
            progress["message"] = "Identifying recipe components..."

            # Process the extracted text using rule-based parsing
            recipe_data = RecipeImageScannerService._parse_recipe_text(extracted_text)

            # Update progress - 100%
            progress["progress"] = 100
            progress["message"] = "Recipe processing complete!"
            progress["status"] = "complete"

            # Add progress to recipe data
            recipe_data["progress"] = progress

            return recipe_data
        except Exception as e:
            logger.error(f"Error processing recipe image: {str(e)}")
            progress = {
                "status": "error",
                "progress": 0,
                "message": f"Error: {str(e)}"
            }
            raise ValueError(f"Failed to process recipe image: {str(e)}")

    @staticmethod
    def _preprocess_image(image):
        """Preprocess image for better OCR results"""
        # Convert PIL Image to OpenCV format
        img = np.array(image)

        # Convert to grayscale
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        else:
            gray = img

        # Apply thresholding to get a binary image
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Apply noise reduction
        denoised = cv2.fastNlMeansDenoising(binary, None, 10, 7, 21)

        # Convert back to PIL Image
        return Image.fromarray(denoised)

    @staticmethod
    def _parse_recipe_text(text: str) -> Dict:
        """
        Process extracted text using rule-based parsing to structure into recipe format

        Args:
            text: Raw text extracted from the image

        Returns:
            Dict containing structured recipe data
        """
        # Initialize recipe data structure
        recipe_data = {
            "title": "",
            "description": "",
            "prep_time": None,
            "cook_time": None,
            "servings": None,
            "ingredients": [],
            "steps": []
        }

        # Split text into lines and clean them
        lines = [line.strip() for line in text.split('\n') if line.strip()]

        # Extract title (usually the first line or a line with larger font)
        if lines:
            recipe_data["title"] = lines[0]
            lines = lines[1:]  # Remove title from lines

        # Process the text to identify sections
        ingredient_section = []
        instruction_section = []
        description_lines = []

        # Identify sections based on keywords
        current_section = "unknown"
        for line in lines:
            line_lower = line.lower()

            # Check for section headers with more comprehensive patterns
            # Ingredient section headers
            if (re.search(r'^ingredients\b|^what\s+you\s*(?:will)?\s*need\b|^you\s*(?:will)?\s*need\b|^shopping\s+list\b', line_lower) or
                re.search(r'^for\s+the\s+ingredients\b|^ingredient\s+list\b', line_lower)):
                current_section = "ingredients"
                continue
            # Instruction section headers
            elif (re.search(r'^instructions\b|^directions\b|^method\b|^preparation\b|^steps\b|^procedure\b', line_lower) or
                  re.search(r'^how\s+to\s+(?:make|prepare|cook)\b|^cooking\s+instructions\b', line_lower) or
                  re.search(r'^to\s+(?:make|prepare|cook)\b|^(?:make|prepare|cook)\s+it\b', line_lower)):
                current_section = "instructions"
                continue
            # Description section headers
            elif (re.search(r'^description\b|^about\b|^notes\b|^introduction\b', line_lower) or
                  re.search(r'^recipe\s+(?:description|notes|tips)\b|^chef.s\s+notes\b', line_lower)):
                current_section = "description"
                continue
            elif "prep time" in line_lower or "preparation time" in line_lower:
                recipe_data["prep_time"] = RecipeImageScannerService._extract_time_value(line)
                continue
            elif "cook time" in line_lower or "cooking time" in line_lower:
                recipe_data["cook_time"] = RecipeImageScannerService._extract_time_value(line)
                continue
            elif "servings" in line_lower or "serves" in line_lower or "yield" in line_lower:
                recipe_data["servings"] = RecipeImageScannerService._extract_servings(line)
                continue

            # Add line to appropriate section
            if current_section == "ingredients":
                ingredient_section.append(line)
            elif current_section == "instructions":
                instruction_section.append(line)
            elif current_section == "description":
                description_lines.append(line)
            elif current_section == "unknown" and len(description_lines) < 3:
                # If we haven't identified a section yet and don't have much description,
                # assume early lines are description
                description_lines.append(line)

        # If we couldn't identify sections clearly, try to infer them
        if not ingredient_section and not instruction_section:
            ingredient_section, instruction_section = RecipeImageScannerService._infer_sections(lines)

        # Process ingredients
        recipe_data["ingredients"] = RecipeImageScannerService._parse_ingredients(ingredient_section)

        # Process instructions
        recipe_data["steps"] = RecipeImageScannerService._parse_instructions(instruction_section)

        # Set description
        recipe_data["description"] = " ".join(description_lines)

        return recipe_data

    @staticmethod
    def _extract_time_value(text: str) -> Optional[int]:
        """Extract time value in minutes from text"""
        # Look for patterns like "30 minutes", "1 hour 15 minutes", etc.
        time_pattern = re.compile(r'(\d+)\s*(?:hour|hr)[s]?\s*(?:and\s*)?(\d+)\s*(?:minute|min)[s]?|(\d+)\s*(?:minute|min)[s]?|(\d+)\s*(?:hour|hr)[s]?', re.IGNORECASE)
        match = time_pattern.search(text)

        if match:
            if match.group(1) and match.group(2):  # hours and minutes
                return int(match.group(1)) * 60 + int(match.group(2))
            elif match.group(3):  # minutes only
                return int(match.group(3))
            elif match.group(4):  # hours only
                return int(match.group(4)) * 60

        # Try to find just numbers
        number_match = re.search(r'(\d+)', text)
        if number_match:
            # Assume minutes if just a number
            return int(number_match.group(1))

        return None

    @staticmethod
    def _extract_servings(text: str) -> Optional[int]:
        """Extract number of servings from text"""
        # Look for patterns like "serves 4", "4 servings", etc.
        servings_pattern = re.compile(r'(?:serve|serving|yield)[s]?\s*(?:\w+\s+)?(\d+)|(\d+)\s*(?:serving|portion)[s]?', re.IGNORECASE)
        match = servings_pattern.search(text)

        if match:
            return int(match.group(1) or match.group(2))

        # Try to find just numbers
        number_match = re.search(r'(\d+)', text)
        if number_match:
            return int(number_match.group(1))

        return None

    @staticmethod
    def _infer_sections(lines: List[str]) -> Tuple[List[str], List[str]]:
        """Infer ingredient and instruction sections when not clearly marked"""
        ingredients = []
        instructions = []

        # Define cooking verbs for detection
        cooking_verbs = ["mix", "stir", "bake", "cook", "add", "pour", "heat", "combine",
                       "chop", "slice", "dice", "mince", "grate", "preheat", "simmer", "boil"]

        # Simplified approach: look for clear patterns
        ingredient_section_started = False
        instruction_section_started = False

        # First pass: identify clear section markers
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()

            # Skip empty lines
            if not line_lower:
                continue

            # Check for section headers
            if re.search(r'^ingredients|^what\s+you\s*need', line_lower):
                ingredient_section_started = True
                instruction_section_started = False
                continue
            elif re.search(r'^instructions|^directions|^method|^steps', line_lower):
                ingredient_section_started = False
                instruction_section_started = True
                continue

            # Add to appropriate section if we've identified a section
            if ingredient_section_started:
                ingredients.append(line)
            elif instruction_section_started:
                instructions.append(line)

        # If we couldn't identify clear sections, use heuristics
        if not ingredients and not instructions:
            # Look for a natural split point - often a blank line or a line with "instructions"
            split_index = -1
            for i, line in enumerate(lines):
                line_lower = line.lower().strip()
                if not line_lower:
                    # Blank line might separate sections
                    split_index = i
                    break
                if re.search(r'instructions|directions|method|steps', line_lower):
                    split_index = i
                    break

            # If we found a split point, use it
            if split_index > 0:
                ingredients = lines[:split_index]
                instructions = lines[split_index+1:]
            else:
                # Otherwise, use simple heuristics
                for line in lines:
                    # Skip empty lines
                    if not line.strip():
                        continue

                    line_lower = line.lower()

                    # Ingredients often have quantities and units
                    if re.search(r'\d+\s*(?:cup|tbsp|tsp|tablespoon|teaspoon|oz|ounce|lb|pound|g|gram|ml|liter|l)\b', line_lower):
                        ingredients.append(line)
                    # Instructions often have cooking verbs
                    elif any(verb in line_lower for verb in cooking_verbs):
                        instructions.append(line)
                    # Instructions often start with numbers or step indicators
                    elif re.match(r'^\d+[\.\)]|^step\s+\d+', line_lower):
                        instructions.append(line)
                    # Ingredients are often shorter lines
                    elif len(line.split()) < 8:
                        ingredients.append(line)
                    # If we can't determine, put longer lines in instructions
                    elif len(line) > 50:
                        instructions.append(line)
                    else:
                        ingredients.append(line)

        return ingredients, instructions

    @staticmethod
    def _parse_ingredients(ingredient_lines: List[str]) -> List[Dict]:
        """Parse ingredient lines into structured data with a simpler approach"""
        ingredients = []

        # Basic units for matching
        basic_units = ["cup", "tbsp", "tsp", "tablespoon", "teaspoon", "oz", "ounce", "lb", "pound",
                      "g", "gram", "ml", "liter", "l", "quart", "pint", "gallon"]

        # Process each line as a complete ingredient
        for line in ingredient_lines:
            # Skip empty lines or likely non-ingredient lines
            if not line or len(line) < 3:
                continue

            # Initialize ingredient data
            ingredient = {
                "name": line.strip(),  # Default to the full line
                "quantity": 1,
                "unit": "",
                "notes": ""
            }

            # Try to extract quantity and unit only if there's a clear pattern
            # Look for patterns like "1 cup" or "2 tablespoons"
            match = re.match(r'^(\d+(?:\s*[\./]\s*\d+)?)\s*([a-zA-Z]+)?\s+(.+)$', line.strip())

            if match:
                quantity_str = match.group(1).strip()
                possible_unit = match.group(2)
                name_part = match.group(3)

                # Only process if we have all parts
                if quantity_str and name_part:
                    try:
                        # Handle fractions like "1/2"
                        if '/' in quantity_str:
                            parts = quantity_str.replace(' ', '').split('/')
                            if len(parts) == 2:
                                ingredient["quantity"] = float(parts[0]) / float(parts[1])
                        else:
                            ingredient["quantity"] = float(quantity_str)

                        # Check if the second part is a unit
                        if possible_unit and any(unit in possible_unit.lower() for unit in basic_units):
                            ingredient["unit"] = possible_unit.lower()
                            ingredient["name"] = name_part.strip()
                        else:
                            # If not a recognized unit, it's part of the name
                            ingredient["name"] = f"{possible_unit} {name_part}".strip()
                    except ValueError:
                        # If we can't parse the quantity, keep the original line
                        ingredient["name"] = line.strip()

            # Extract notes in parentheses
            notes_match = re.search(r'\(([^)]+)\)', ingredient["name"])
            if notes_match:
                ingredient["notes"] = notes_match.group(1).strip()
                # Remove notes from name
                ingredient["name"] = re.sub(r'\([^)]+\)', '', ingredient["name"]).strip()

            # Clean up the name
            ingredient["name"] = ingredient["name"].strip(',.:;')

            # Add to ingredients list
            ingredients.append(ingredient)

        return ingredients

    @staticmethod
    def _parse_instructions(instruction_lines: List[str]) -> List[Dict]:
        """Parse instruction lines into structured steps with a simpler approach"""
        steps = []
        current_step = ""
        step_number = 1

        # First, try to find numbered steps
        numbered_steps_found = False

        for line in instruction_lines:
            # Skip empty lines
            if not line.strip():
                continue

            # Check if line starts with a number or "Step X"
            step_match = re.match(r'^(\d+)[\.\)]|^step\s+(\d+)', line.lower())

            if step_match:
                numbered_steps_found = True

                # If we have accumulated text for a previous step, save it
                if current_step:
                    steps.append({
                        "step_number": step_number,
                        "description": current_step.strip()
                    })
                    step_number += 1

                # Start a new step
                # Extract the step number if available, otherwise use our counter
                if step_match.group(1):
                    step_number = int(step_match.group(1))
                elif step_match.group(2):
                    step_number = int(step_match.group(2))

                # Remove the step number from the text
                current_step = re.sub(r'^(\d+)[\.\)]|^step\s+\d+', '', line, flags=re.IGNORECASE).strip()
            else:
                # If not a new step, append to current step
                if current_step:
                    current_step += " " + line
                else:
                    current_step = line

        # Add the last step if there is one
        if current_step and numbered_steps_found:
            steps.append({
                "step_number": step_number,
                "description": current_step.strip()
            })

        # If we couldn't find numbered steps, try to split by sentences or use each line as a step
        if not steps and instruction_lines:
            # Try to use sentences if the text is one big paragraph
            if len(instruction_lines) <= 3 and any(len(line) > 100 for line in instruction_lines):
                # Join all lines
                text = " ".join(instruction_lines)

                # Use our custom sentence tokenizer that handles errors
                sentences = custom_sent_tokenize(text)

                # Create a step for each sentence
                for i, sentence in enumerate(sentences):
                    if sentence.strip():
                        steps.append({
                            "step_number": i + 1,
                            "description": sentence.strip()
                        })
            else:
                # Use each line as a separate step
                for i, line in enumerate(instruction_lines):
                    if line.strip():
                        steps.append({
                            "step_number": i + 1,
                            "description": line.strip()
                        })

        return steps
