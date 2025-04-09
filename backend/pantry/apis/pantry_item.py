import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import PantryItemService

logger = logging.getLogger(__name__)

class PantryItemAPI:

    @staticmethod
    def list(request) -> Dict:
        if request.method == 'GET':
            logger.info('pantry_item method "list" called')
            # Get user-specific pantry items if user is authenticated
            user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None
            return JsonResponse(PantryItemService.list(user_id=user_id), safe=False)
        elif request.method == 'POST':
            logger.info('pantry_item method "create" called')
            data = json.loads(request.body.decode("utf-8"))
            # Associate the item with the current user if authenticated
            user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None
            if user_id:
                data['user'] = user_id
            return JsonResponse(PantryItemService.create(validated_data=data))

    @staticmethod
    def detail(request, id) -> Dict:
        if request.method == 'GET':
            logger.info(f'pantry_item method "get" called with id {id}')
            return JsonResponse(PantryItemService.get(id=id))
        elif request.method == 'PUT':
            logger.info(f'pantry_item method "update" called with id {id}')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(PantryItemService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info(f'pantry_item method "delete" called with id {id}')
            return JsonResponse(PantryItemService.delete(id=id))

    @staticmethod
    def add_grocery_list(request, grocery_list_id) -> Dict:
        if request.method == 'POST':
            logger.info(f'pantry_item method "add_grocery_list" called with grocery_list_id {grocery_list_id}')
            # Get the current user ID
            user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None
            if not user_id:
                return JsonResponse({"status": "error", "message": "User not authenticated"}, status=401)
            
            return JsonResponse(PantryItemService.add_grocery_list_to_pantry(
                grocery_list_id=grocery_list_id,
                user_id=user_id
            ))
