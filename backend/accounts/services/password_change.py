import logging
from django.contrib.auth import get_user_model
from rest_framework import serializers

from ..serializers.password_change import PasswordChangeSerializer

logger = logging.getLogger(__name__)
User = get_user_model()

class PasswordChangeService:
    @staticmethod
    def change_password(user, validated_data):
        """
        Change a user's password
        """
        serializer = PasswordChangeSerializer(data=validated_data, context={'user': user})
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        # Save the new password
        user.set_password(serializer.validated_data['new_password1'])
        user.save()
        logger.info(f"Password changed successfully for user {user.username}")
        
        return {"detail": "Password has been changed successfully."}
