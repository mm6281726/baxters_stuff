import logging
from django.http import JsonResponse
from typing import Dict

from ..services import GroceryListService

logger = logging.getLogger(__name__)

class GroceryListAPI:

    @staticmethod
    def list(request, **kwargs) -> Dict:
        logger.info('method "list" called')
        if request.method == 'GET':
            return JsonResponse(GroceryListService.list(), safe=False)
        elif request.method == 'POST':
            logger.info('method "create" called')
            return JsonResponse(GroceryListService.create(**kwargs))
    
    @staticmethod
    def detail(request, id, **kwargs) -> Dict:
        if request.method == 'GET':
            logger.info('method "get" called')
            return JsonResponse(GroceryListService.get(id))
        elif request.method == 'POST':
            logger.info('method "update" called')
            return JsonResponse(GroceryListService.update(id, **kwargs))
        elif request.method == 'DELETE':
            logger.info('method "delete" called')
            return JsonResponse(GroceryListService.delete(id, **kwargs))
      