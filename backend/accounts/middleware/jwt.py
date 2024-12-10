from rest_framework import exceptions

from ..services import LoginService

def JwtMiddleware(get_response):
    PREFIX = 'JWT '
    allowPaths = ('/api/accounts/login/',)

    def middleware(request):
        path = request.path
        if path.startswith(allowPaths):
            return get_response(request)

        access = request.META.get('HTTP_AUTHORIZATION')
        access = __get_token(access)
        if access is None:
            raise exceptions.AuthenticationFailed("No token.")
        
        user = LoginService.get_authenticated_user(access)
        if user:
            request.user = user
            return get_response(request)
        else:
            raise exceptions.AuthenticationFailed("Token does match user.")
        
    def __get_token(header):
        if not header.startswith(PREFIX):
            raise exceptions.AuthenticationFailed('Invalid token')

        return header[len(PREFIX):]

    return middleware