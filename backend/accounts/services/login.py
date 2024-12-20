from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework_simplejwt.tokens import AccessToken

from ..serializers import LoginSerializer, LoginRefreshSerializer

class LoginService:
    def login(validated_data):
        serializer = LoginSerializer(data=validated_data)
        if not serializer.is_valid():
            raise exceptions.AuthenticationFailed(serializer.errors)
        
        return serializer.validated_data
    
    def refresh(validated_data):
        serializer = LoginRefreshSerializer(data=validated_data)
        if not serializer.is_valid():
            raise exceptions.AuthenticationFailed(serializer.errors)
        
        return serializer.validated_data
    
    def get_authenticated_user(access):
        access_token = AccessToken(access)
        user_id = access_token['user_id']
        if user_id is None:
            return
        return LoginService.__get_user_by_id(user_id)
    
    def __get_user_by_id(id):
        User = get_user_model()
        return User.objects.get(id=id)