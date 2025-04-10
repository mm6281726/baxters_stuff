import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import RecipeItemService

logger = logging.getLogger(__name__)

class RecipeItemAPI:

    @staticmethod
    def list(request, recipe_id) -> Dict:
        if request.method == 'GET':
            logger.info(f'recipe_item method "list" called for recipe_id {recipe_id}')
            return JsonResponse(RecipeItemService.list(recipe_id=recipe_id), safe=False)
        elif request.method == 'POST':
            logger.info(f'recipe_item method "create" called for recipe_id {recipe_id}')
            data = json.loads(request.body.decode("utf-8"))
            data['recipe'] = recipe_id
            return JsonResponse(RecipeItemService.create(validated_data=data))

    @staticmethod
    def detail(request, id) -> Dict:
        if request.method == 'GET':
            logger.info(f'recipe_item method "get" called with id {id}')
            return JsonResponse(RecipeItemService.get(id=id))
        elif request.method == 'PUT':
            logger.info(f'recipe_item method "update" called with id {id}')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(RecipeItemService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info(f'recipe_item method "delete" called with id {id}')
            return JsonResponse(RecipeItemService.delete(id=id))

    @staticmethod
    def add_to_grocery_list(request, recipe_id, grocery_list_id) -> Dict:
        if request.method == 'POST':
            logger.info(f'recipe_item method "add_to_grocery_list" called with recipe_id {recipe_id} and grocery_list_id {grocery_list_id}')
            return JsonResponse(RecipeItemService.add_to_grocery_list(recipe_id=recipe_id, grocery_list_id=grocery_list_id))
