from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import TaskSerializer, ProjectSerializer
from .models import Task, Project
    
class AssignedProjectList(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): # get projects for which user is assigned to
        user = self.request.user
        return user.assigned_projects.all()
        # return Project.objects.filter(team=user)

class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): # get all tasks for given project
        project = self.kwargs.get('project_id')
        if project is not None:
            return Task.objects.filter(project=project)

    def perform_create(self, serializer): # create task for given project
        project = self.kwargs.get('project_id')
        if serializer.is_valid() and project is not None:
            serializer.save(author=self.request.user, project=project)
        else:
            print(serializer.errors)
            raise ValidationError("Project ID is required.")

class AssignedTaskList(generics.ListAPIView):
    serializer_class = TaskSerializer        
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project = self.kwargs.get('project_id')
        if project is not None:
            user = self.request.user
            if user is None:
                return ValidationError('User is required to query results.')
            return Task.objects.filter(project=project, assigned_to__in=[user]) # get all tasks in given project which are assigned to user
        else:
            return ValidationError('Project ID is required.')

class TaskItem(generics.RetrieveAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "task_id"

    def get_queryset(self): # get task of given id of all tasks for specific project
        project = self.kwargs.get('project_id')
        return Task.objects.filter(project=project)
    
    def get_object(self):
        return super().get_object()

class TaskDelete(generics.DestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "task_id"

    # def perform_destroy(self, instance):
    #     task_id = self.kwargs.get('task_id')
    #     task = self.get_object(task_id)
    #     task.delete()
    def get_queryset(self):
        project = self.kwargs.get('project_id')
        return Task.objects.filter(project=project)

class TaskUpdate(generics.UpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "task_id"

    def get_queryset(self): # get all tasks for given project
        project = self.kwargs.get('project_id')
        return Task.objects.filter(project=project)

    
