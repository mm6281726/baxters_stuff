from django.http import JsonResponse
from rest_framework import exceptions

from ..services import LoginService

def JwtMiddleware(get_response):
    PREFIX = 'JWT '
    allowPaths = ('/api/accounts/',)

    def middleware(request):
        path = request.path
        if path.startswith(allowPaths):
            return get_response(request)

        try:
            access = request.META.get('HTTP_AUTHORIZATION')
            access = __get_token(access)
            if access is None:
                raise exceptions.AuthenticationFailed("No token.")
        
            try:
                user = LoginService.get_authenticated_user(access)
            except Exception as exception:
                raise exceptions.AuthenticationFailed("Token is expired.")

            if user:
                request.user = user
                return get_response(request)
            else:
                raise exceptions.AuthenticationFailed("Could not verify token.")
        except exceptions.AuthenticationFailed as exception:
            return JsonResponse({ 'message': exception.detail, }, status=exception.status_code)
        
    def __get_token(header):
        if not header.startswith(PREFIX):
            raise exceptions.AuthenticationFailed('Invalid token.')

        return header[len(PREFIX):]

    return middleware