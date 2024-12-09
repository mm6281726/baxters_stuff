import json
import logging
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from typing import Dict

from ..services import GroceryListService

logger = logging.getLogger(__name__)

class GroceryListAPI:
    permission_classes = (IsAuthenticated, )
    
    @staticmethod
    def list(request) -> Dict:
        if request.method == 'GET':
            logger.info('grocery_list method "list" called')
            return JsonResponse(GroceryListService.list(), safe=False)
        elif request.method == 'POST':
            logger.info('grocery_list method "create" called')
            data=json.loads(request.body.decode("utf-8"))
            return JsonResponse(GroceryListService.create(validated_data=data))
    
    @staticmethod
    def detail(request, id) -> Dict:
        if request.method == 'GET':
            logger.info('grocery_list method "get" called')
            return JsonResponse(GroceryListService.get(id))
        elif request.method == 'PUT':
            logger.info('grocery_list method "update" called')
            data=json.loads(request.body.decode("utf-8"))
            return JsonResponse(GroceryListService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info('grocery_list method "delete" called')
            return JsonResponse(GroceryListService.delete(id=id))
      