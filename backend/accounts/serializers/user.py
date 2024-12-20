from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=200)
    email = serializers.EmailField(allow_blank=True)
    password1 = serializers.CharField(max_length=200)
    password2 = serializers.CharField(max_length=200)

    def validate(self, validated_data):
        password1 = validated_data['password1']
        password2 = validated_data['password2']
        
        if(password1 != password2):
            raise serializers.ValidationError('Password could not be confirmed.')
        
        return validated_data

    def create(self, validated_data):
        email = validated_data['email']
        username = validated_data['username']
        password = validated_data['password1']
        
        try:
            user = User.objects.create(
                username=username,
                email=email,
            )
        except Exception as e:
            raise serializers.ValidationError('Username is invalid or already exists.') 

        user.set_password(password)
        user.save()
        
        return user