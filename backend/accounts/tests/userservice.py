from rest_framework import serializers
from rest_framework.test import APITestCase

from ..models import User
from ..services import UserService

class UserServiceTest(APITestCase):
    def setUp(self):
        username = 'test_user'
        password = 'Pass123!'
        user = User.objects.create_user(username=username, password=password)
        user.save()

        self.user = user

    def test_list(self):
        """
        Test list() successfully returns users
        """
        users = UserService.list()
        self.assertIsNotNone(users)
        self.assertEqual(users[0]['id'], self.user.id)

    def test_create_no_fields(self):
        """
        Test create() fails with no fields
        """
        username = None
        email = None
        password1 = None
        password2 = None
        validated_data = {
            'username': username,
            'email': email,
            'password1': password1,
            'password2': password2,
        }
        
        with self.assertRaises(serializers.ValidationError):
            UserService.create(validated_data)

    def test_create_no_username(self):
        """
        Test create() fails with no username
        """
        username = None
        email = None
        password1 = 'test_pass_2'
        password2 = 'test_pass_2'
        validated_data = {
            'username': username,
            'email': email,
            'password1': password1,
            'password2': password2,
        }
        
        with self.assertRaises(serializers.ValidationError):
            UserService.create(validated_data)

    def test_create_no_password(self):
        """
        Test create() fails with no password
        """
        username = "test_user_2"
        email = None
        password1 = None
        password2 = None
        validated_data = {
            'username': username,
            'email': email,
            'password1': password1,
            'password2': password2,
        }
        
        with self.assertRaises(serializers.ValidationError):
            UserService.create(validated_data)

    def test_create_no_matching_password(self):
        """
        Test create() fails with no matching password
        """
        username = "test_user_2"
        email = None
        password1 = 'test_pass_2'
        password2 = 'wrong_pass'
        validated_data = {
            'username': username,
            'email': email,
            'password1': password1,
            'password2': password2,
        }
        
        with self.assertRaises(serializers.ValidationError):
            UserService.create(validated_data)

    def test_create(self):
        """
        Test create() successfully creates users
        """
        username = 'test_user_2'
        email = ''
        password1 = 'test_pass_2'
        password2 = 'test_pass_2'
        validated_data = {
            'username': username,
            'email': email,
            'password1': password1,
            'password2': password2,
        }
        
        response = UserService.create(validated_data)
        self.assertIsNotNone(response['refresh'])
        self.assertIsNotNone(response['access'])
        self.assertIsNotNone(response['user'])
        self.assertEqual(response['user']['id'], 2)