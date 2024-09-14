from django.db import models
from django.conf import settings

class Project(models.Model):
    title = models.CharField(max_length=100, blank=False)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, related_name="created_projects", default=1)
    team = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="assigned_projects")

    def __str__(self) -> str:
        return self.title

task_state = (
    (1, "NOT_ASSIGNED"),
    (2, "IN_PROGRESS"),
    (3, "ON_HOLD"),
    (4, "COMPLETED"),
)

class Task(models.Model):
    title = models.CharField(max_length=100, blank=False)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
    last_modified = models.DateTimeField(auto_now=True)
    state = models.IntegerField(choices=task_state, default=1)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_tasks") # User.created_tasks.all(), Task can only have 1 author, author(User) can be a creator of many Tasks
    assigned_to = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="assigned_tasks", blank=True) # ManyToManyField -> wiele userów do jednego zadania, User.assigned_tasks.all(), blank -> przypisanie tasku moze byc opcjonalne
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks", blank=False) # Project.tasks.all(), Task can only have 1 project object - one to many relationship, Project can have many Tasks -> Project.tasks.all()

    def __str__(self):
        return self.title