from django.urls import path, include
from .views import MessageList

urlpatterns = [
    path("messages/task/<int:task_id>/", MessageList.as_view(), name="chat-message-list"),
]

