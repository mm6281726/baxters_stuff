import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services.recipe_image_scanner import RecipeImageScannerService

logger = logging.getLogger(__name__)

class RecipeImageScannerAPI:

    @staticmethod
    def scan_image(request) -> Dict:
        """
        Scan an uploaded image for recipe data
        """
        if request.method == 'POST':
            logger.info('recipe_image_scanner method "scan_image" called')

            # Ensure user is authenticated
            user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None

            # Check if image file is in the request
            if 'image' not in request.FILES:
                return JsonResponse({"error": "Image file is required"}, status=400)

            try:
                image_file = request.FILES['image']
                
                # Process the image
                recipe_data = RecipeImageScannerService.scan_image(image_file)
                return JsonResponse(recipe_data)
            except ValueError as e:
                return JsonResponse({"error": str(e)}, status=400)
            except Exception as e:
                logger.error(f"Error scanning image: {str(e)}")
                return JsonResponse({"error": "Failed to scan recipe image"}, status=500)
