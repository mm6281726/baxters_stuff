import json
import logging
from django.http import JsonResponse
from rest_framework import serializers

from ..services.password_reset import PasswordResetService

logger = logging.getLogger(__name__)

class PasswordResetAPI:
    @staticmethod
    def request_reset(request):
        """
        API endpoint to request a password reset
        """
        if request.method == 'POST':
            logger.info('password reset request called')
            try:
                data = json.loads(request.body.decode("utf-8"))
                response = PasswordResetService.request_password_reset(validated_data=data)
                return JsonResponse(response)
            except serializers.ValidationError as e:
                return JsonResponse({"errors": e.detail}, status=400)
            except Exception as e:
                logger.error(f"Error in password reset request: {str(e)}")
                return JsonResponse({"errors": "An error occurred processing your request."}, status=500)
    
    @staticmethod
    def confirm_reset(request):
        """
        API endpoint to confirm a password reset
        """
        if request.method == 'POST':
            logger.info('password reset confirm called')
            try:
                data = json.loads(request.body.decode("utf-8"))
                response = PasswordResetService.confirm_password_reset(validated_data=data)
                return JsonResponse(response)
            except serializers.ValidationError as e:
                return JsonResponse({"errors": e.detail}, status=400)
            except Exception as e:
                logger.error(f"Error in password reset confirmation: {str(e)}")
                return JsonResponse({"errors": "An error occurred processing your request."}, status=500)
