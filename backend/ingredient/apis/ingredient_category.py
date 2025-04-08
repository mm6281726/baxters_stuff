import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import IngredientCategoryService

logger = logging.getLogger(__name__)

class IngredientCategoryAPI:

    @staticmethod
    def list(request) -> Dict:
        if request.method == 'GET':
            logger.info('ingredients method "list" called')
            return JsonResponse(IngredientCategoryService.list(), safe=False)
        elif request.method == 'POST':
            logger.info('ingredients method "create" called')
            data = json.loads(request.body.decode("utf-8"))
            logger.info(f'Received data for category creation: {data}')
            result = IngredientCategoryService.create(validated_data=data)
            logger.info(f'Category creation result: {result}')
            return JsonResponse(result)

    @staticmethod
    def detail(request, id) -> Dict:
        if request.method == 'GET':
            logger.info('ingredients method "get" called')
            return JsonResponse(IngredientCategoryService.get(id))
        elif request.method == 'PUT':
            logger.info('ingredients method "update" called')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(IngredientCategoryService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info('ingredients method "delete" called')
            return JsonResponse(IngredientCategoryService.delete(id=id))
