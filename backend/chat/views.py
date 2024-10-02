from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import MessageSerializer
from .models import Room, Message

class MessageList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        task_id = self.kwargs.get("task_id")
        return Room.messages.filter(task=task_id)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
