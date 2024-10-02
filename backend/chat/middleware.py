from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.security.websocket import WebsocketDenier
from auth_api.models import CustomUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import ExpiredSignatureError, InvalidSignatureError, DecodeError
from jwt import decode as jwt_decode
from django.contrib.auth.models import AnonymousUser
from django.conf import settings

class JWTAuthMiddleware():
    """
    Custom middleware that takes a token from the query string and authenticates it.
    """
    def __init__(self, app):
        self.app = app # store asgi app 

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            return user
        except CustomUser.DoesNotExist:
            return None

    async def __call__(self, scope, receive, send):
        try:
            token = parse_qs(scope["query_string"].decode("utf8")).get("token", None)[0]
            decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            scope["user"] = await self.get_user(decoded_data["user_id"])
        except (KeyError, TypeError, ExpiredSignatureError, InvalidSignatureError, DecodeError) as e:
            # ExpiredSignatureError -> jwt token expired and is not valid, InvalidSignatureError -> signature of token not valid, signature does not match key, DecodeError-> token's format not valid
            print(f'Invalid token: {e}')
            scope["user"] = AnonymousUser()
        return await self.app(scope, receive, send)
        #     try:
        #         UntypedToken(token) # Check validity of token
        #     except (InvalidToken, TokenError) as e:
        #         print(f"Invalid token: {e}")
        #         denier = WebsocketDenier()
        #         return await denier(scope, receive, send) # Deny request when token is invalid or expired
    
