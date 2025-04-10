from rest_framework import serializers

from ..models import User
from ..serializers import UserSerializer, UserCreateSerializer
from ..services import LoginService

class UserService:
    def list():
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return serializer.data

    def get(id):
        try:
            user = User.objects.get(id=id)
            serializer = UserSerializer(user)
            return serializer.data
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "User not found"})

    def create(validated_data):
        validated_data['password'] = validated_data['password1']
        serializer = UserCreateSerializer(data=validated_data)
        if serializer.is_valid():
            serializer.save()
        else:
            raise serializers.ValidationError(serializer.errors)

        return LoginService.login(validated_data)

    def update(id, validated_data):
        try:
            user = User.objects.get(id=id)

            # Update basic fields
            if 'username' in validated_data:
                user.username = validated_data['username']
            if 'email' in validated_data:
                user.email = validated_data['email']
            if 'first_name' in validated_data:
                user.first_name = validated_data['first_name']
            if 'last_name' in validated_data:
                user.last_name = validated_data['last_name']

            # Save the user
            user.save()

            # Return the updated user data
            serializer = UserSerializer(user)
            return serializer.data
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "User not found"})

    def delete(id):
        try:
            user = User.objects.get(id=id)
            user.delete()
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "User not found"})