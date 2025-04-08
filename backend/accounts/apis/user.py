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
    def detail(request):
        return
