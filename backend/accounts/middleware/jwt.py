from django.http import JsonResponse
from rest_framework import exceptions

from ..services import LoginService

class JwtMiddleware:
    PREFIX = 'JWT '
    allowPaths = ('/api/accounts/',)

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if JwtMiddleware.__allow_request(request):
            return self.get_response(request)

        try:
            response = JwtMiddleware.__create_response(self, request)
            return response
        except exceptions.AuthenticationFailed as exception:
            return JsonResponse({ 'message': exception.detail, }, status=exception.status_code)
        

    @staticmethod
    def __allow_request(request):
        path = request.path
        return path.startswith(JwtMiddleware.allowPaths)
    
    @staticmethod
    def __create_response(self, request):
        user = JwtMiddleware.__authenticate(request)
        if user:
            request.user = user
        else:
            raise exceptions.AuthenticationFailed("Could not verify token.")
        
        return self.get_response(request)

    @staticmethod
    def __authenticate(request):
        access = JwtMiddleware.__get_token(request)
        try:
            user = LoginService.get_authenticated_user(access)
        except Exception as exception:
            raise exceptions.AuthenticationFailed("Token is expired.")
        
        return user

    @staticmethod
    def __get_token(request):
        header = JwtMiddleware.__get_header(request)
        token = header[len(JwtMiddleware.PREFIX):]
        if token is None:
                raise exceptions.AuthenticationFailed("No token.")
        
        return token
    
    @staticmethod
    def __get_header(request):
        header = request.META.get('HTTP_AUTHORIZATION')
        if not header or not header.startswith(JwtMiddleware.PREFIX):
            raise exceptions.AuthenticationFailed('Invalid token.')

        return header