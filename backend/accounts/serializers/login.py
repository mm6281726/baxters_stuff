from django.contrib.auth import get_user_model
from rest_framework import exceptions, serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .user import UserSerializer

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=200)
    password = serializers.CharField(max_length=200)

    def validate(self, validated_data):
        username = validated_data.get('username')
        password = validated_data.get('password')
        user = LoginSerializer.__get_user_by_username(username)

        if(user is None):
            raise exceptions.AuthenticationFailed('user not found')
        if(not user.check_password(password)):
            raise exceptions.AuthenticationFailed('wrong password')

        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        }

    def __get_user_by_username(username):
        User = get_user_model()
        return User.objects.filter(username=username).first()