import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

from ..services import LoginService

logger = logging.getLogger(__name__)

class LoginAPI():

    @staticmethod
    @ensure_csrf_cookie
    def list(request):
        if request.method == 'GET':
            logger.info('login method "list" called')
            csrftoken = request.COOKIES.get('csrftoken')
            return JsonResponse({"csrftoken": csrftoken})
        elif request.method == 'POST':
            logger.info('login method "create" called')
            data=json.loads(request.body.decode("utf-8"))
            return JsonResponse(LoginService.login(validated_data=data))

    @staticmethod    
    def refresh(request):
        if request.method == 'POST':
            logger.info('login method "refresh" called')
            data=json.loads(request.body.decode("utf-8"))
            return JsonResponse(LoginService.refresh(validated_data=data))
