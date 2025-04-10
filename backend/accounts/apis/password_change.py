import json
import logging
from django.http import JsonResponse
from rest_framework import serializers

from ..services.password_change import PasswordChangeService

logger = logging.getLogger(__name__)

class PasswordChangeAPI:
    @staticmethod
    def change_password(request):
        """
        API endpoint to change a user's password
        """
        if request.method == 'POST':
            logger.info('password change called')
            try:
                data = json.loads(request.body.decode("utf-8"))
                response = PasswordChangeService.change_password(request.user, validated_data=data)
                return JsonResponse(response)
            except serializers.ValidationError as e:
                return JsonResponse({"detail": str(e)}, status=400)
            except Exception as e:
                logger.error(f"Error in password change: {str(e)}")
                return JsonResponse({"detail": "An error occurred processing your request."}, status=500)
