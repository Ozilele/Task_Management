from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from auth_api.serializers import UserModelSerializer
from .serializers import TaskSerializer, ProjectSerializer
from .helpers import map_task_state_to_id
from .models import Task, Project
    
class AssignedProjectList(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): # get all projects in which user is assigned to
        user = self.request.user
        assigned_projects = user.assigned_projects.all()
        return {
            "user": user,
            "assigned_projects": assigned_projects
        }

    def list(self, request, *args, **kwargs):
        query_dict = self.get_queryset()
        return Response({
            "logged_user": UserModelSerializer(query_dict['user']).data,
            "assigned_projects": ProjectSerializer(query_dict['assigned_projects'], many=True).data,
        }, status=status.HTTP_200_OK)

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
            # 'logged_user': UserModelSerializer(request.user).data, # logged in user
            'tasks': TaskSerializer(tasks, many=True).data, # serialization of tasks
            'project_team': UserModelSerializer(team, many=True).data # serialization of project_team
        }, status=status.HTTP_200_OK)
    
    def post(self, request, project_id):
        if project_id is None:
            return ValidationError("Project ID is required")
        request.data['state'] = map_task_state_to_id(request.data)
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return ValidationError("Project not found")
        serializer = TaskSerializer(data=request.data) # deserialization of incoming data
        if serializer.is_valid():
            serializer.save(author=request.user, project=project) # saving an object intance in db
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AssignedTaskList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        if project_id is None:
            return Response("Bad request - project_id is required.", status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if user is None:
            return ValidationError('User is required to query results.')
        assigned_tasks = Task.objects.filter(project=project_id, assigned_to__in=[user])
        serializer = TaskSerializer(assigned_tasks, many=True)
        return Response({
            "tasks": serializer.data # serialization of tasks
        }, status=status.HTTP_200_OK)
        # get all tasks in given project which are assigned to user

class CreatedTaskList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        if project_id is None:
            return Response("Bad request - project_id is required.", status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if user is None:
            return ValidationError('User is required to query results.')
        created_tasks = Task.objects.filter(project=project_id, author=user)
        serializer = TaskSerializer(created_tasks, many=True)
        return Response({
            "tasks": serializer.data
        }, status=status.HTTP_200_OK)

class TaskDetail(APIView): # View for getting single task, updating, deleting
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, project_id, task_id, format=None):
        task = self.get_object(task_id)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, project_id, task_id, format=None):
        task = self.get_object(task_id)
        request.data['state'] = map_task_state_to_id(request.data)
        serializer = TaskSerializer(task, data=request.data, partial=True) # self.update() -> updating an instance, partial = True for partial update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, project_id, task_id, format=None):
        task = self.get_object(task_id)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# class TaskUpdate(generics.UpdateAPIView):
#     serializer_class = TaskSerializer
#     permission_classes = [IsAuthenticated]
#     lookup_field = "task_id"
#     def get_queryset(self): # get all tasks for given project
#         project = self.kwargs.get('project_id')
#         return Task.objects.filter(project=project)
#     def perform_update(self, serializer):
#         project = self.kwargs.get('project_id')
#         if serializer.is_valid() and project is not None:
#             serializer.save(project=project)    
#         else:
#             print(serializer.errors)
#             raise ValidationError("Project ID is required")