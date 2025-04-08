import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import IngredientService

logger = logging.getLogger(__name__)

class IngredientAPI:

    @staticmethod
    def list(request) -> Dict:
        if request.method == 'GET':
            logger.info('ingredients method "list" called')
            return JsonResponse(IngredientService.list(), safe=False)
        elif request.method == 'POST':
            logger.info('ingredients method "create" called')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(IngredientService.create(validated_data=data))
    
    @staticmethod
    def detail(request, id) -> Dict:
        if request.method == 'GET':
            logger.info('ingredients method "get" called')
            return JsonResponse(IngredientService.get(id))
        elif request.method == 'PUT':
            logger.info('ingredients method "update" called')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(IngredientService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info('ingredients method "delete" called')
            return JsonResponse(IngredientService.delete(id=id))
