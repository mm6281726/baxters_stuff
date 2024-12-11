from rest_framework import serializers

from ..models import User
from ..serializers import UserSerializer
from ..services import LoginService

class UserService:
    def list():
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return serializer.data

    def create(validated_data):
        email = validated_data['email']
        username = validated_data['username']
        password1 = validated_data['password1']
        password2 = validated_data['password2']

        if(password1 != password2):
            raise serializers.ValidationError('Password could not be confirmed.') 

        try:
            user = User.objects.create(
                username=username,
                email=email,
            )
        except Exception as e:
            raise serializers.ValidationError('Username already exists.') 

        user.set_password(password1)
        user.save()

        validated_data['password'] = password1
        return LoginService.login(validated_data)