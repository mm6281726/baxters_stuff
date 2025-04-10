from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True, min_length=8)
    new_password2 = serializers.CharField(required=True, min_length=8)

    def validate(self, data):
        user = self.context.get('user')
        
        # Check if current password is correct
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({"current_password": "Current password is incorrect."})
        
        # Check if new passwords match
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({"new_password2": "New passwords don't match."})
        
        return data
