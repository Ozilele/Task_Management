from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager

class CustomUser(AbstractUser):
    username = models.CharField(max_length=40, unique=True, blank=False)
    email = models.EmailField('email address', unique=True, blank=False)
    has_email_verified = models.BooleanField("has email verified", default=False, blank=True)
    date_joined  = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username']
    objects = CustomUserManager()

    def __str__(self):
        return self.email

# Custom models defining users of the application and their permissions (Later - TO DO)
class ProjectManager(models.Model):
    pass    

developer_level = (
    (1, "JUNIOR"),
    (2, "MID"),
    (3, "SENIOR")
)
developer_role = (
    (1, "Mobile"),
    (2, "Backend"),
    (3, "Frontend"),
    (4, "Full stack"),
    (5, "Machine learning"),
    (6, "DevOps"),
    (7, "Security"),
)
devloper_stack = (
    (1, "Python"),
    (2, "Java"),
    (3, "JS"),
    (4, "C++"),
    (5, "Kotlin"),
    (6, "Swift"),
)

class Developer(models.Model):
    skill = models.IntegerField(choices=developer_level, default=1, blank=False)
    role = models.IntegerField(choices=developer_role, default=1, blank=False)
    stack = models.IntegerField(choices=devloper_stack, default=1, blank=False)


