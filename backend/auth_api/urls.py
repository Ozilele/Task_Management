from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .views import UserRegistrationView, CustomTokenObtainPairView, ActivateAccount

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("activate/<uidb64>/<token>/", ActivateAccount.as_view(), name="activate"),
    path("token/", CustomTokenObtainPairView.as_view(), name="get-token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh-token"),
]

