from django.urls import path
from . import admin_views
from .views import AssignedProjectList, TaskListCreate, TaskDelete, TaskUpdate, TaskItem, AssignedTaskList

urlpatterns = [
    path("admin/projects/", admin_views.ProjectListCreate.as_view(), name="project-list"),
    path("admin/projects/update/<int:project_id>/", admin_views.ProjectUpdate.as_view(), name="update-project"),
    path("admin/projects/delete/<int:project_id>/", admin_views.ProjectDelete.as_view(), name="delete-project"),
    path("projects/", AssignedProjectList.as_view(), name="assigned-project-list"),
    path("projects/<int:project_id>/tasks/", TaskListCreate.as_view(), name="project-tasks"), # get tasks for given project, create task for given project 
    path("projects/<int:project_id>/assigned-tasks/", AssignedTaskList.as_view(), name="assigned-tasks"), # get assigned tasks in given project to user
    path("projects/<int:project_id>/tasks/<int:task_id>/", TaskItem.as_view(), name="task-detail"), # get individual task
    path("projects/<int:project_id>/tasks/delete/<int:task_id>/", TaskDelete.as_view(), name="delete-task"), # delete task
    path("projects/<int:project_id>/tasks/update/<int:task_id>/", TaskUpdate.as_view(), name="update-task"), # update task
]

