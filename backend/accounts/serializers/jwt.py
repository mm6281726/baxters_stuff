from rest_framework import serializers

class JwtMiddlewareSerializer(serializers.Serializer):
    def validate(self, validated_data):
        return


    # def __allow_request(request):
    #     path = request.path
    #     return path.startswith(JwtMiddleware.allowPaths)
    
    # def __create_response(self, request):
    #     user = JwtMiddleware.__authenticate(request)
    #     if user:
    #         request.user = user
    #     else:
    #         raise exceptions.AuthenticationFailed("Could not verify token.")
        
    #     return self.get_response(request)

    # def __authenticate(request):
    #     access = JwtMiddleware.__get_token(request)
    #     try:
    #         user = LoginService.get_authenticated_user(access)
    #     except Exception as exception:
    #         raise exceptions.AuthenticationFailed("Token is expired.")
        
    #     return user

    # def __get_token(request):
    #     header = JwtMiddleware.__get_header(request)
    #     token = header[len(JwtMiddleware.PREFIX):]
    #     if token is None:
    #             raise exceptions.AuthenticationFailed("No token.")
        
    #     return token
    
    # def __get_header(request):
    #     header = request.META.get('HTTP_AUTHORIZATION')
    #     if not header or not header.startswith(JwtMiddleware.PREFIX):
    #         raise exceptions.AuthenticationFailed('Invalid token.')

    #     return header