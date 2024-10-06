from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .serializers import MessageSerializer
from .models import Room, Message
from auth_api.models import CustomUser

class RoomMessageList(generics.ListAPIView): # View for listing messages in room
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        task_id = self.kwargs.get("task_id")
        project_id = self.kwargs.get("project_id")
        if task_id is not None:
            room = Room.objects.get(task=task_id)
            return room.messages.all().order_by("timestamp")
        elif project_id is not None:
            room = Room.objects.get(project=project_id)
            return room.messages.all().order_by("timestamp")

class ReceivedMessageList(generics.ListAPIView): # View for getting received messages for user or getting messages with specific user
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        recipient_username = self.kwargs.get("username")
        user = self.request.user
        
        if recipient_username is None:
            return user.received_messages.all() # Get all received messages
        else:
            try:
                recipient = CustomUser.objects.get(username=recipient_username)
            except CustomUser.DoesNotExist:
                return Message.objects.none()
            messages = Message.objects.filter(
                (Q(author=user) & Q(receiver=recipient)) | 
                (Q(author=recipient) & Q(receiver=user))
            ).order_by('timestamp')
            return messages
