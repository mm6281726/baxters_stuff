import logging
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers

from ..serializers.password_reset import PasswordResetRequestSerializer, PasswordResetConfirmSerializer

logger = logging.getLogger(__name__)
User = get_user_model()

class PasswordResetService:
    @staticmethod
    def request_password_reset(validated_data):
        """
        Process a password reset request and send an email with reset instructions
        """
        serializer = PasswordResetRequestSerializer(data=validated_data)
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Generate token and UID
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Create reset URL (frontend URL)
        reset_url = f"http://localhost:3000/reset-password/{uid}/{token}"
        
        # Send email
        subject = "Password Reset for Baxter's Stuff"
        message = f"""
        Hello {user.username},
        
        You requested a password reset for your Baxter's Stuff account.
        
        Please click the link below to reset your password:
        
        {reset_url}
        
        If you didn't request this, you can safely ignore this email.
        
        This link will expire in 24 hours.
        
        Regards,
        Baxter's Stuff Team
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER if hasattr(settings, 'EMAIL_HOST_USER') else 'noreply@baxtersstuff.com',
                [email],
                fail_silently=False,
            )
            logger.info(f"Password reset email sent to {email}")
            return {"detail": "Password reset email has been sent."}
        except Exception as e:
            logger.error(f"Failed to send password reset email: {str(e)}")
            raise serializers.ValidationError({"email": "Failed to send password reset email."})
    
    @staticmethod
    def confirm_password_reset(validated_data):
        """
        Confirm a password reset request and set the new password
        """
        serializer = PasswordResetConfirmSerializer(data=validated_data)
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        # Save the new password
        user = serializer.save()
        logger.info(f"Password reset successful for user {user.username}")
        
        return {"detail": "Password has been reset successfully."}
