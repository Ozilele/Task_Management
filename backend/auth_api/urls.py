from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .views import UserRegistrationView, CustomTokenObtainPairView, ActivateAccount

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"), # registration view
    path("activate/<uidb64>/<token>/", ActivateAccount.as_view(), name="activate"), # activate e-mail view
    path("token/", CustomTokenObtainPairView.as_view(), name="get-token"), # login view
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh-token"),
]

