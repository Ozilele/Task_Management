from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/auth/", include("auth_api.urls")),
    path('api-auth/', include('rest_framework.urls')),
    path("api/", include("task_api.urls")),
    path("chat/", include("chat.urls")),
]
