from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User

class JwtMiddlewareTests(APITestCase):
    def setUp(self):
        username = 'test_user'
        password = 'Pass123!'
        user = User.objects.create_user(username=username, password=password)
        user.save()

        self.user = user
        self.access = str(RefreshToken.for_user(user).access_token)

    def test_middleware_allowed_path(self):
        """
        Test middleware() allows allowedPath urls through without authentication
        """
        response = self.client.get('/api/accounts/login/', {'username': 'test_user', 'password': 'Pass123!'}, format='json')
        self.assertEqual(response.status_code, 200)

    def test_middleware_no_token(self):
        """
        Test middleware() fails if no access token
        """
        token = ''

        self.client.credentials(HTTP_AUTHORIZATION=token)
        response = self.client.get('/api/grocerylist/')

        self.assertEqual(response.status_code, 401)

    def test_middleware_bad_token(self):
        """
        Test middleware() fails if no access token
        """
        token = 'JWT test_token'
        
        self.client.credentials(HTTP_AUTHORIZATION=token)
        response = self.client.get('/api/grocerylist/')

        self.assertEqual(response.status_code, 401)
        
    def test_middleware_bad_prefix(self):
        """
        Test middleware() fails if no access token
        """
        access = self.access
        token = "Bearer " + access

        self.client.credentials(HTTP_AUTHORIZATION=token)
        response = self.client.get('/api/grocerylist/')

        self.assertEqual(response.status_code, 401)

    def test_middleware(self):
        """
        Test middleware() authenticates and adds user to request
        """
        user = self.user
        access = self.access
        token = "JWT " + access

        self.client.credentials(HTTP_AUTHORIZATION=token)
        response = self.client.get('/api/grocerylist/')

        self.assertEqual(response.status_code, 200)