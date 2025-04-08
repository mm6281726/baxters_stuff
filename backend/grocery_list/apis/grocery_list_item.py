import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import GroceryListItemService

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
