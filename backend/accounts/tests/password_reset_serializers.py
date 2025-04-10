from django.test import TestCase
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from ..models import User
from ..serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer

class PasswordResetSerializersTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='test_user',
            email='test@example.com',
            password='Pass123!'
        )
        self.uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token = default_token_generator.make_token(self.user)

    def test_password_reset_request_serializer_valid(self):
        """
        Test PasswordResetRequestSerializer with valid email
        """
        data = {'email': 'test@example.com'}
        serializer = PasswordResetRequestSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_password_reset_request_serializer_invalid_email(self):
        """
        Test PasswordResetRequestSerializer with invalid email
        """
        data = {'email': 'nonexistent@example.com'}
        serializer = PasswordResetRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
    
    def test_password_reset_confirm_serializer_valid(self):
        """
        Test PasswordResetConfirmSerializer with valid data
        """
        data = {
            'uid': self.uid,
            'token': self.token,
            'new_password1': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        serializer = PasswordResetConfirmSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_password_reset_confirm_serializer_passwords_dont_match(self):
        """
        Test PasswordResetConfirmSerializer with mismatched passwords
        """
        data = {
            'uid': self.uid,
            'token': self.token,
            'new_password1': 'NewPass123!',
            'new_password2': 'DifferentPass123!'
        }
        serializer = PasswordResetConfirmSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('new_password2', serializer.errors)
    
    def test_password_reset_confirm_serializer_invalid_uid(self):
        """
        Test PasswordResetConfirmSerializer with invalid uid
        """
        data = {
            'uid': 'invalid-uid',
            'token': self.token,
            'new_password1': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        serializer = PasswordResetConfirmSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('uid', serializer.errors)
    
    def test_password_reset_confirm_serializer_invalid_token(self):
        """
        Test PasswordResetConfirmSerializer with invalid token
        """
        data = {
            'uid': self.uid,
            'token': 'invalid-token',
            'new_password1': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        serializer = PasswordResetConfirmSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('token', serializer.errors)
    
    def test_password_reset_confirm_serializer_save(self):
        """
        Test PasswordResetConfirmSerializer save method changes password
        """
        data = {
            'uid': self.uid,
            'token': self.token,
            'new_password1': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        serializer = PasswordResetConfirmSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        user = serializer.save()
        self.assertEqual(user.id, self.user.id)
        self.assertTrue(user.check_password('NewPass123!'))
