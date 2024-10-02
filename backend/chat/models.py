from django.db import models
from django.conf import settings
from task_api.models import Task, Project

class Room(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="chat", blank=True, null=True) # Task_obj.chat -> single chat application on each Task  
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="chat", blank=True, null=True) # Project_obj.chat -> single chat app on each Project
    online = models.ManyToManyField(to=settings.AUTH_USER_MODEL, blank=True) # list of online users

    def get_online_count(self):
        return self.online.count()
    
    def join(self, user):
        self.online.add(user)
        self.save()

    def leave(self, user):
        self.online.remove(user)
        self.save() # save the instance after removing user from online list

    def __str__(self):
        return f"{self.project}, {self.task}: {self.get_online_count()}"

class Message(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages", blank=False) # User.sent_messages.all()
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="messages", blank=True, null=True) # Room.messages.all()
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_messages", blank=True, null=True) # User.received_messages.all()
    content = models.TextField(blank=True) 
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    attachment = models.FileField(blank=True)

    def __str__(self):  
        return f'{self.author.username}: {self.content} [{self.timestamp}]'
