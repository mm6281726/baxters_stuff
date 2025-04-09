import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import RecipeStepService

logger = logging.getLogger(__name__)

class RecipeStepAPI:

    @staticmethod
    def list(request, recipe_id) -> Dict:
        if request.method == 'GET':
            logger.info(f'recipe_step method "list" called for recipe_id {recipe_id}')
            return JsonResponse(RecipeStepService.list(recipe_id=recipe_id), safe=False)
        elif request.method == 'POST':
            logger.info(f'recipe_step method "create" called for recipe_id {recipe_id}')
            data = json.loads(request.body.decode("utf-8"))
            data['recipe'] = recipe_id
            return JsonResponse(RecipeStepService.create(validated_data=data))

    @staticmethod
    def detail(request, id) -> Dict:
        if request.method == 'GET':
            logger.info(f'recipe_step method "get" called with id {id}')
            return JsonResponse(RecipeStepService.get(id=id))
        elif request.method == 'PUT':
            logger.info(f'recipe_step method "update" called with id {id}')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(RecipeStepService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info(f'recipe_step method "delete" called with id {id}')
            return JsonResponse(RecipeStepService.delete(id=id))
