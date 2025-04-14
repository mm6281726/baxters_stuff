import json
import logging
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from ..services.unit_conversion import PantryUnitConversionService

logger = logging.getLogger(__name__)

@require_http_methods(["POST"])
def convert_pantry_item_units(request, pantry_item_id):
    """
    API endpoint to convert a pantry item's quantity to a different unit
    
    Request body:
    {
        "to_unit": string
    }
    
    Response:
    {
        "id": number,
        "quantity": number,
        "unit": string,
        "converted": boolean
    }
    """
    try:
        data = json.loads(request.body)
        to_unit = data.get('to_unit')
        
        if not to_unit:
            return JsonResponse({
                'error': 'Missing required parameter: to_unit'
            }, status=400)
        
        result = PantryUnitConversionService.convert_pantry_item_units(
            pantry_item_id=pantry_item_id,
            to_unit=to_unit
        )
        
        return JsonResponse(result)
    except Exception as e:
        logger.error(f"Error in convert_pantry_item_units: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=400)

@require_http_methods(["POST"])
def convert_grocery_to_pantry(request, grocery_item_id):
    """
    API endpoint to convert a grocery list item to a pantry item
    
    Request body:
    {
        "to_unit": string (optional)
    }
    
    Response:
    {
        "id": number,
        "quantity": number,
        "unit": string,
        "stock_level": string,
        "converted": boolean
    }
    """
    try:
        data = json.loads(request.body)
        to_unit = data.get('to_unit')
        
        # Get the user ID from the request
        user_id = request.user.id
        
        result = PantryUnitConversionService.convert_grocery_to_pantry(
            grocery_item_id=grocery_item_id,
            user_id=user_id,
            to_unit=to_unit
        )
        
        return JsonResponse(result)
    except Exception as e:
        logger.error(f"Error in convert_grocery_to_pantry: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=400)
