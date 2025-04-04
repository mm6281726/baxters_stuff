import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import GroceryListService, GroceryListItemService

logger = logging.getLogger(__name__)

class GroceryListItemAPI:

    @staticmethod
    def list(request, grocery_list_id) -> Dict:
        if request.method == 'GET':
            logger.info('grocery_list_item method "list" called')
            return JsonResponse(GroceryListItemService.list(grocery_list_id), safe=False)
        elif request.method == 'POST':
            logger.info('grocery_list_item method "create" called')
            data = json.loads(request.body.decode("utf-8"))
            # Ensure the item is associated with the correct grocery list
            data['grocery_list'] = grocery_list_id
            return JsonResponse(GroceryListItemService.create(validated_data=data))

    @staticmethod
    def detail(request, id) -> Dict:
        if request.method == 'GET':
            logger.info('grocery_list_item method "get" called')
            return JsonResponse(GroceryListItemService.get(id))
        elif request.method == 'PUT':
            logger.info('grocery_list_item method "update" called')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(GroceryListItemService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info('grocery_list_item method "delete" called')
            return JsonResponse(GroceryListItemService.delete(id=id))

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
