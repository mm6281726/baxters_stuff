from rest_framework.exceptions import AuthenticationFailed
from rest_framework.test import APITestCase

from ..models import User
from ..services import LoginService

class LoginServiceTests(APITestCase):
    def setUp(self):
        username = 'test_user'
        password = 'Pass123!'
        user = User.objects.create_user(username=username, password=password)
        user.save()

        self.user = user


    def test_login_no_user_no_pass(self):
        """
        Test login fails with no username or password
        """
        validated_data = {}
        with self.assertRaises(AuthenticationFailed):
            LoginService.login(validated_data)
    
    def test_login_no_user(self):
        """
        Test login fails with no username
        """
        validated_data = {
            'password': 'Pass123!',
        }
        with self.assertRaises(AuthenticationFailed):
            LoginService.login(validated_data)

    def test_login_no_pass(self):
        """
        Test login fails with no password
        """
        validated_data = {
            'username': 'test_user',
        }
        with self.assertRaises(AuthenticationFailed):
            LoginService.login(validated_data)

    def test_login_user_does_not_exist(self):
        """
        Test login fails with user not existing
        """
        validated_data = {
            'username': 'does_not_exist',
            'password': 'Pass123!',
        }
        with self.assertRaises(AuthenticationFailed):
            LoginService.login(validated_data)

    def test_login_bad_pass(self):
        """
        Test login fails with bad password
        """
        validated_data = {
            'username': 'test_user',
            'password': 'wrong_password',
        }
        with self.assertRaises(AuthenticationFailed):
            LoginService.login(validated_data)

    def test_login(self):
        """
        Test login succeeds
        """
        validated_data = {
            'username': 'test_user',
            'password': 'Pass123!',
        }
        
        response = LoginService.login(validated_data)
        self.assertIsNotNone(response['refresh'])
        self.assertIsNotNone(response['access'])
        self.assertEqual(response['user']['id'], self.user.id)