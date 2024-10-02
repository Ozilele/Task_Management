from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/project/(?P<project_id>\w+)/$", consumers.ChatConsumer.as_asgi()),
    re_path(r"ws/chat/task/(?P<task_id>\w+)/$", consumers.ChatConsumer.as_asgi()),
    re_path(r"ws/private-chat/", consumers.ChatConsumer.as_asgi()),
]
