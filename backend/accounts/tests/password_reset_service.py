from django.test import TestCase
from django.core import mail
from rest_framework import serializers

from ..models import User
from ..services import PasswordResetService

class PasswordResetServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='test_user',
            email='test@example.com',
            password='Pass123!'
        )
    
    def test_request_password_reset_valid_email(self):
        """
        Test request_password_reset with valid email
        """
        data = {'email': 'test@example.com'}
        response = PasswordResetService.request_password_reset(data)
        
        # Check response
        self.assertIn('detail', response)
        self.assertIn('Password reset email has been sent', response['detail'])
        
        # Check that an email was sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['test@example.com'])
        self.assertIn('Password Reset', mail.outbox[0].subject)
    
    def test_request_password_reset_invalid_email(self):
        """
        Test request_password_reset with invalid email
        """
        data = {'email': 'nonexistent@example.com'}
        
        with self.assertRaises(serializers.ValidationError):
            PasswordResetService.request_password_reset(data)
    
    def test_confirm_password_reset_valid(self):
        """
        Test confirm_password_reset with valid data
        """
        # First request a password reset to get a valid token
        PasswordResetService.request_password_reset({'email': 'test@example.com'})
        
        # Extract the token and uid from the email
        email_body = mail.outbox[0].body
        reset_url = [line for line in email_body.split('\n') if 'reset-password' in line][0].strip()
        
        # Parse the URL to get uid and token
        parts = reset_url.split('/')
        uid = parts[-2]
        token = parts[-1]
        
        # Now confirm the password reset
        data = {
            'uid': uid,
            'token': token,
            'new_password1': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        
        response = PasswordResetService.confirm_password_reset(data)
        
        # Check response
        self.assertIn('detail', response)
        self.assertIn('Password has been reset successfully', response['detail'])
        
        # Check that the password was changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPass123!'))
    
    def test_confirm_password_reset_invalid_data(self):
        """
        Test confirm_password_reset with invalid data
        """
        data = {
            'uid': 'invalid-uid',
            'token': 'invalid-token',
            'new_password1': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        
        with self.assertRaises(serializers.ValidationError):
            PasswordResetService.confirm_password_reset(data)
