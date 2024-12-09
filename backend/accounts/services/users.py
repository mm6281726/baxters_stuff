from ..models import User
from ..serializers import UserSerializer

class UserService:
    def list():
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return serializer.data

    def create(validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()

        serializer = UserSerializer(user)
        return serializer.data