import json
from django.test import TestCase
from django.core import mail

from ..models import User

class PasswordResetAPITests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='test_user',
            email='test@example.com',
            password='Pass123!'
        )
        self.request_url = '/api/accounts/password-reset/'
        self.confirm_url = '/api/accounts/password-reset/confirm/'

    def test_request_password_reset_valid_email(self):
        """
        Test password reset request API with valid email
        """
        data = {'email': 'test@example.com'}
        response = self.client.post(
            self.request_url,
            json.dumps(data),
            content_type='application/json'
        )

        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertIn('detail', response_data)
        self.assertIn('Password reset email has been sent', response_data['detail'])

        # Check that an email was sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['test@example.com'])

    def test_request_password_reset_invalid_email(self):
        """
        Test password reset request API with invalid email
        """
        data = {'email': 'nonexistent@example.com'}
        response = self.client.post(
            self.request_url,
            json.dumps(data),
            content_type='application/json'
        )

        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertIn('errors', response_data)

    def test_confirm_password_reset(self):
        """
        Test password reset confirmation API
        """
        # First request a password reset to get a valid token
        data = {'email': 'test@example.com'}
        self.client.post(
            self.request_url,
            json.dumps(data),
            content_type='application/json'
        )

        # Extract the token and uid from the email
        email_body = mail.outbox[0].body
        reset_url = [line for line in email_body.split('\n') if 'reset-password' in line][0].strip()

        # Parse the URL to get uid and token
        parts = reset_url.split('/')
        uid = parts[-2]
        token = parts[-1]

        # Now confirm the password reset
        confirm_data = {
            'uid': uid,
            'token': token,
            'new_password1': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }

        response = self.client.post(
            self.confirm_url,
            json.dumps(confirm_data),
            content_type='application/json'
        )

        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertIn('detail', response_data)
        self.assertIn('Password has been reset successfully', response_data['detail'])

        # Check that the password was changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPass123!'))

    def test_confirm_password_reset_invalid_data(self):
        """
        Test password reset confirmation API with invalid data
        """
        confirm_data = {
            'uid': 'invalid-uid',
            'token': 'invalid-token',
            'new_password1': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }

        response = self.client.post(
            self.confirm_url,
            json.dumps(confirm_data),
            content_type='application/json'
        )

        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertIn('errors', response_data)
