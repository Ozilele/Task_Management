from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from auth_api.serializers import UserModelSerializer
from .serializers import TaskSerializer, ProjectSerializer
from .models import Task, Project, task_state
    
class AssignedProjectList(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): # get all projects in which user is assigned to
        user = self.request.user
        return user.assigned_projects.all()
        # return Project.objects.filter(team=user)

class CreatedProjectList(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): # get user's created projects
        user = self.request.user
        return Project.objects.filter(author=user)

class TaskList(APIView): 
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.prefetch_related('team', 'tasks__assigned_to').get(id=project_id)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        tasks = project.tasks.all() # all the tasks to given project
        team = project.team.all() # the team in the project
        return Response({
            'tasks': TaskSerializer(tasks, many=True).data, # serialization of tasks
            'project_team': UserModelSerializer(team, many=True).data # serialization of project_team
        }, status=status.HTTP_200_OK)
    
    def post(self, request, project_id):
        if project_id is None:
            return ValidationError("Project ID is required")
        state_txt = request.data.pop('state')
        for state in task_state:
            id, txt = state
            if txt == state_txt:
                state_id = id
        request.data['state'] = state_id
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return ValidationError("Project not found")
        serializer = TaskSerializer(data=request.data) # deserialization of incoming data
        if serializer.is_valid():
            serializer.save(author=request.user, project=project) # saving an object intance in db
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class CreatedTaskList(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project = self.kwargs.get('project_id')
        if project is not None:
            user = self.request.user
            if user is None:
                return ValidationError('User is required to query results.')
            return Task.objects.filter(project=project, author=user)
        else:
            return ValidationError("Project ID is required.")

class TaskDetail(APIView): # View for getting single task, updating, deleting
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Task.objects.get(id=pk)
        except Task.DoesNotExist:
            pass

    def get(self, request, project_id, task_id, format=None):
        task = self.get_object(task_id)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, project_id, task_id, format=None):
        task = self.get_object(task_id)
        serializer = TaskSerializer(task, data=request.data) # self.update() -> updating an instance
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, project_id, task_id, format=None):
        task = self.get_object(task_id)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
    
    def perform_update(self, serializer):
        project = self.kwargs.get('project_id')
        if serializer.is_valid() and project is not None:
            serializer.save(project=project)    
        else:
            print(serializer.errors)
            raise ValidationError("Project ID is required")
    
