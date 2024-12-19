from rest_framework import serializers

from ..models import User
from ..serializers import UserSerializer, UserCreateSerializer
from ..services import LoginService

class UserService:
    def list():
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return serializer.data

    def create(validated_data):
        validated_data['password'] = validated_data['password1']
        serializer = UserCreateSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        else:
            raise serializers.ValidationError(serializer.errors)

        return LoginService.login(validated_data)