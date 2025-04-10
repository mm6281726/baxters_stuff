import json
import logging
from django.http import JsonResponse

from ..services import UserService

logger = logging.getLogger(__name__)

class UserAPI:

    @staticmethod
    def list(request):
        if request.method == 'GET':
            logger.info('user method "list" called')
            return JsonResponse(UserService.list(), safe=False)
        elif request.method == 'POST':
            logger.info('user method "create" called')
            data=json.loads(request.body.decode("utf-8"))
            return JsonResponse(UserService.create(validated_data=data))



    @staticmethod
    def detail(request, id):
        if request.method == 'GET':
            logger.info(f'user method "detail" called for id {id}')
            return JsonResponse(UserService.get(id=id))
        elif request.method == 'PUT':
            logger.info(f'user method "update" called for id {id}')
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(UserService.update(id=id, validated_data=data))
        elif request.method == 'DELETE':
            logger.info(f'user method "delete" called for id {id}')
            UserService.delete(id=id)
            return JsonResponse({"detail": "User deleted successfully"})
