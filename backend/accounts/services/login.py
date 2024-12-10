from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from ..serializers.user import UserSerializer

class LoginService:
    def login(validated_data):
        username = validated_data.get('username')
        password = validated_data.get('password')
        user = LoginService.__get_user_by_username(username)
        
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
        refresh = RefreshToken(validated_data.get('refresh'))
        access = refresh.access_token
        return {
            'refresh': str(refresh),
            'access': str(access),
        }
    
    def get_authenticated_user(access):
        access_token = AccessToken(access)
        user_id = access_token['user_id']
        if user_id is None:
            return
        return LoginService.__get_user_by_id(user_id)
    
    def __get_user_by_id(id):
        User = get_user_model()
        return User.objects.get(id=id)

    def __get_user_by_username(username):
        User = get_user_model()
        return User.objects.filter(username=username).first()