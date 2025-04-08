import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import GroceryListService

logger = logging.getLogger(__name__)

class GroceryListAPI:

    @staticmethod
    def list(request) -> Dict:
        if request.method == 'GET':
            logger.info('grocery_list method "list" called')
            # Get user-specific lists if user is authenticated
            user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None
            return JsonResponse(GroceryListService.list(user_id=user_id), safe=False)
        elif request.method == 'POST':
            logger.info('grocery_list method "create" called')
            data = json.loads(request.body.decode("utf-8"))
            # Associate the list with the current user if authenticated
            user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None
            return JsonResponse(GroceryListService.create(validated_data=data, user_id=user_id))

    @staticmethod
    def detail(request, id) -> Dict:
        if request.method == 'GET':
            logger.info('grocery_list method "get" called')
            return JsonResponse(GroceryListService.get(id))
        elif request.method == 'PUT':
            logger.info('grocery_list method "update" called')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(GroceryListService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info('grocery_list method "delete" called')
            return JsonResponse(GroceryListService.delete(id=id))
