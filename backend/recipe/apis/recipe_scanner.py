import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import RecipeScannerService

logger = logging.getLogger(__name__)

class RecipeScannerAPI:

    @staticmethod
    def scan(request) -> Dict:
        """
        Scan a URL for recipe data
        """
        if request.method == 'POST':
            logger.info('recipe_scanner method "scan" called')

            # Get the URL from the request body
            data = json.loads(request.body.decode("utf-8"))
            url = data.get('url')

            if not url:
                return JsonResponse({"error": "URL is required"}, status=400)

            try:
                # Get user ID if authenticated
                user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None

                # Scan the URL
                recipe_data = RecipeScannerService.scan_url(url=url, user_id=user_id)
                return JsonResponse(recipe_data)
            except ValueError as e:
                return JsonResponse({"error": str(e)}, status=400)
            except Exception as e:
                logger.error(f"Error scanning URL: {str(e)}")
                return JsonResponse({"error": "Failed to scan recipe URL"}, status=500)

    @staticmethod
    def create_from_scan(request) -> Dict:
        """
        Create a new recipe from scanned data
        """
        if request.method == 'POST':
            logger.info('recipe_scanner method "create_from_scan" called')

            # Ensure user is authenticated
            if not hasattr(request, 'user') or not request.user.is_authenticated:
                return JsonResponse({"error": "Authentication required"}, status=401)

            try:
                # Get the scanned data from the request body
                if request.body:
                    data = json.loads(request.body.decode("utf-8"))
                else:
                    return JsonResponse({"error": "No data provided"}, status=400)

                # Create recipe from scanned data
                recipe = RecipeScannerService.create_recipe_from_scan(
                    scan_data=data,
                    user_id=request.user.id
                )
                return JsonResponse(recipe)
            except json.JSONDecodeError as e:
                logger.error(f"Error decoding JSON: {str(e)}")
                return JsonResponse({"error": "Invalid JSON data"}, status=400)
            except Exception as e:
                logger.error(f"Error creating recipe from scan: {str(e)}")
                return JsonResponse({"error": "Failed to create recipe from scan"}, status=500)
