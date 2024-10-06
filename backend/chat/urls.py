from django.urls import path
from .views import RoomMessageList, ReceivedMessageList

urlpatterns = [
    path("messages/task/<int:task_id>/", RoomMessageList.as_view(), name="chat-task-message-list"),
    path("messages/project/<int:project_id>/", RoomMessageList.as_view(), name="chat-project-message-list"),
    path("messages/", ReceivedMessageList.as_view(), name="received-messages"),
    path("messages/<str:username>/", ReceivedMessageList.as_view(), name="messages_with_user"),
]

