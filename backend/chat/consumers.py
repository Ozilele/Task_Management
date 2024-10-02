import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .serializers import MessageSerializer
from .models import Message, Room

class ChatConsumer(WebsocketConsumer):

    def connect(self): # when a client connects to WebSocket
        user = self.scope["user"]
        if not user.is_authenticated:
            print("Not authenticated")
            self.close() # close connection when user is not authenticated
            return
        if 'project_id' in self.scope['url_route']['kwargs']:
            project_id = int(self.scope['url_route']['kwargs']['project_id'])
            self.room_group_name = "chat_project_%s" % project_id
            project_room = None
            if not Room.objects.filter(project=project_id).exists(): # Create new Project Room
                project_room = Room()
                project_room.project_id = project_id
                project_room.save(update_fields=["project"])
            else:
                project_room = Room.objects.get(project=project_id)
            project_room.join(user) # add client to project room online users
            self.room = project_room
        elif 'task_id' in self.scope['url_route']['kwargs']:
            task_id = int(self.scope['url_route']['kwargs']['task_id'])
            self.room_group_name = "chat_task_%s" % task_id
            task_room = None
            if not Room.objects.filter(task=task_id).exists(): # Create new Task Room
                task_room = Room()
                task_room.task_id = task_id
                task_room.save(update_fields=['task'])
            else:
                task_room = Room.objects.get(task=task_id)
            task_room.join(user) # add client to task room online users
            self.room = task_room
        # every consumer has a scope containing info about connection
        async_to_sync(self.channel_layer.group_add)( # Join room group
            self.room_group_name,
            self.channel_name # every consumer instance has automatically generated unique channel name
        )
        self.accept()

    def disconnect(self, close_code): # when a connection is closed, leave room group
        if self.scope["user"] is not None:
            self.room.leave(self.scope["user"]) # remove user from online list
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None): # when a consumer server receives a message from client(websocket), broadcast this msg to all consumer instances in group corresponding to the room name
        user = self.scope.get("user")
        if user is not None:
            text_data_json = json.loads(text_data)
            type = text_data_json["message_type"]
            message_content = text_data_json['message']
            message = Message(
                content=message_content,
            )
            message.author_id = user.id
            if type == "room":
                message.room_id = self.room.id
            elif type == "private":
                message.receiver_id = text_data_json['receiver_id']
            message.save() # Save message to database
            async_to_sync(self.channel_layer.group_send)( # sends an event to group, event has a special 'type' corresponding to method that should be invoked on consumers that receive the event
                self.room_group_name, { "type": "chat.message", "message_type": type, "message_data": message }
            )

    def chat_message(self, event): # Receive message from room group 
        message = MessageSerializer(event['message_data'])
        type = event["message_type"]
        # Send message to client(Websocket)
        self.send(text_data=json.dumps({ "type": "msg_received", "message": message.data, "message_type": type }))