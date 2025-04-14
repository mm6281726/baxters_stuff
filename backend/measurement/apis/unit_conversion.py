from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
import logging

from ..services.unit_conversion import convert_units, get_unit_type
from ingredient.models import Ingredient

logger = logging.getLogger(__name__)

@require_http_methods(["POST"])
def convert_units_api(request):
    """
    API endpoint to convert units
    
    Request body:
    {
        "quantity": number,
        "from_unit": string,
        "to_unit": string,
        "ingredient_id": number (optional)
    }
    
    Response:
    {
        "converted_quantity": number,
        "from_unit": string,
        "to_unit": string,
        "is_exact": boolean
    }
    """
    try:
        data = json.loads(request.body)
        quantity = data.get('quantity')
        from_unit = data.get('from_unit')
        to_unit = data.get('to_unit')
        ingredient_id = data.get('ingredient_id')
        
        if not all([quantity is not None, from_unit, to_unit]):
            return JsonResponse({
                'error': 'Missing required parameters'
            }, status=400)
        
        ingredient_name = None
        if ingredient_id:
            try:
                ingredient = Ingredient.objects.get(id=ingredient_id)
                ingredient_name = ingredient.name
            except Ingredient.DoesNotExist:
                return JsonResponse({
                    'error': f'Ingredient with ID {ingredient_id} not found'
                }, status=404)
        
        # Determine if this is an exact conversion
        from_type = get_unit_type(from_unit)
        to_type = get_unit_type(to_unit)
        is_exact = from_type == to_type and from_type != 'count'
        
        # Perform the conversion
        converted_quantity = convert_units(
            quantity, 
            from_unit, 
            to_unit, 
            ingredient_name
        )
        
        return JsonResponse({
            'converted_quantity': float(converted_quantity),
            'from_unit': from_unit,
            'to_unit': to_unit,
            'is_exact': is_exact
        })
    except ValueError as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)
    except Exception as e:
        logger.error(f"Error in convert_units_api: {str(e)}")
        return JsonResponse({
            'error': 'An unexpected error occurred'
        }, status=500)

@require_http_methods(["GET"])
def get_common_units(request):
    """
    API endpoint to get common units
    
    Response:
    {
        "weight": [
            {"value": "g", "label": "Grams (g)"},
            ...
        ],
        "volume": [
            {"value": "ml", "label": "Milliliters (ml)"},
            ...
        ],
        "count": [
            {"value": "", "label": "Count (no unit)"}
        ]
    }
    """
    common_units = {
        "weight": [
            {"value": "g", "label": "Grams (g)"},
            {"value": "kg", "label": "Kilograms (kg)"},
            {"value": "oz", "label": "Ounces (oz)"},
            {"value": "lb", "label": "Pounds (lb)"}
        ],
        "volume": [
            {"value": "ml", "label": "Milliliters (ml)"},
            {"value": "l", "label": "Liters (l)"},
            {"value": "tsp", "label": "Teaspoons (tsp)"},
            {"value": "tbsp", "label": "Tablespoons (tbsp)"},
            {"value": "cup", "label": "Cups"},
            {"value": "pint", "label": "Pints"},
            {"value": "quart", "label": "Quarts"},
            {"value": "gallon", "label": "Gallons"}
        ],
        "count": [
            {"value": "", "label": "Count (no unit)"}
        ]
    }
    
    return JsonResponse(common_units)
