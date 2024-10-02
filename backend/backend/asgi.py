import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from chat.middleware import JWTAuthMiddleware
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({ # ProtocolTypeRouter will inspect the type of connection http or ws:// and route the connections
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        AllowedHostsOriginValidator(
            URLRouter(
              chat.routing.websocket_urlpatterns
            ),
        )
    )
})

