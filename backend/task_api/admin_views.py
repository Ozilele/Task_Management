from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import ProjectSerializer
from .models import Project

class ProjectListCreate(generics.ListCreateAPIView): # admin view - list all projects, create new project for ProjectManager
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self): # get all projects
        projects = Project.objects.all()
        return projects
    
    def perform_create(self, serializer): # create a project
        author = self.request.user
        if serializer.is_valid():
            serializer.save(author=author)
        else:
            print(serializer.errors)
            raise ValidationError("Author of project is required.")

class ProjectDelete(generics.DestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny] # IsAdmin
    lookup_field = "project_id"

class ProjectUpdate(generics.UpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    lookup_field = "project_id"