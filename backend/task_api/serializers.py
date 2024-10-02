from rest_framework import serializers
from .models import Task, Project

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        extra_kwargs = {"author": {"read_only": True}, "project": {"read_only": True}}

    def create(self, validated_data): # creates django object model from request's data
        assigned_users = validated_data.pop('assigned_to')
        instance = Task.objects.create(**validated_data)
        instance.assigned_to.set(assigned_users)
        return instance
    
    def to_representation(self, instance): # TO JSON format
        obj = super().to_representation(instance)
        obj.pop("state")
        obj['state'] = instance.get_state_display()
        return obj
    
    
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "title", "description", "created_at", "last_modified", "author", "team"]
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        project_team = validated_data.pop('team')
        instance = Project.objects.create(**validated_data)
        instance.team = project_team
        return instance
    
    def to_representation(self, instance): # TO JSON
        obj = super().to_representation(instance)
        return obj
