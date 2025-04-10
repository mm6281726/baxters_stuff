import logging
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
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

        # Get frontend URL from settings or use default
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        reset_url = f"{frontend_url}/reset-password/{uid}/{token}"

        # Send email
        subject = "Password Reset for Baxter's Stuff"

        # Context for email template
        context = {
            'username': user.username,
            'reset_url': reset_url,
            'valid_hours': 24
        }

        # Create HTML message
        html_message = render_to_string('password_reset_email.html', context)
        # Create plain text message
        plain_message = strip_tags(html_message)

        try:
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
                html_message=html_message
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
