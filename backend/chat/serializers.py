from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "author", "room", "receiver", "content", "timestamp"]
        extra_kwargs = {"author": {"read_only": True}, "room": {"read_only": True}, "receiver": {"read_only": True}}
    
    def create(self, validated_data):
        # if validated_data.get("receiver") is not None:
        #     instance = Message.objects.create()
        instance = Message.objects.create(**validated_data)
        return instance

    def to_representation(self, instance): # TO JSON format
        obj = super().to_representation(instance)
        obj.pop("room")
        return obj