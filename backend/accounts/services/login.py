from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework_simplejwt.tokens import RefreshToken

from ..serializers.user import UserSerializer

class LoginService:
    def login(validated_data):
        username = validated_data.get('username')
        password = validated_data.get('password')
        user = LoginService.__get_user(username)
        
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
    
    def refresh(validated_data):
        refresh = validated_data.get('refresh')
        access = RefreshToken.access_token(refresh)
        return {
            'access': str(access),
        }
    
    def __get_user(username):
        User = get_user_model()
        return User.objects.filter(username=username).first()