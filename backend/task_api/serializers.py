from rest_framework import serializers
from .models import Task, Project

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        assigned_users = validated_data.pop('assigned_to')
        instance = Task.objects.create(**validated_data)
        instance.assigned_to = assigned_users
        return instance

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
    