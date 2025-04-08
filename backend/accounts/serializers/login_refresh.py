from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

class LoginRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField(max_length=512)

    def validate(self, validated_data):
        refresh = RefreshToken(validated_data.get('refresh'))
        access = refresh.access_token
        return {
            'refresh': str(refresh),
            'access': str(access),
        }
