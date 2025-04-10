import json
import logging
from django.http import JsonResponse
from typing import Dict

from ..services import RecipeService

logger = logging.getLogger(__name__)

class RecipeAPI:

    @staticmethod
    def list(request) -> Dict:
        if request.method == 'GET':
            logger.info('recipe method "list" called')
            # Get user-specific recipes if user is authenticated
            user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None
            return JsonResponse(RecipeService.list(user_id=user_id), safe=False)
        elif request.method == 'POST':
            logger.info('recipe method "create" called')
            data = json.loads(request.body.decode("utf-8"))
            # Associate the recipe with the current user if authenticated
            user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None
            return JsonResponse(RecipeService.create(validated_data=data, user_id=user_id))

    @staticmethod
    def detail(request, id) -> Dict:
        if request.method == 'GET':
            logger.info(f'recipe method "get" called with id {id}')
            return JsonResponse(RecipeService.get(id=id))
        elif request.method == 'PUT':
            logger.info(f'recipe method "update" called with id {id}')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(RecipeService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info(f'recipe method "delete" called with id {id}')
            return JsonResponse(RecipeService.delete(id=id))
