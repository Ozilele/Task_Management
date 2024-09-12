from typing import Any, Dict
from .models import CustomUser
from django.contrib.auth import authenticate
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

class UserModelSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=5)
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "password", "has_email_verified", "date_joined", "is_superuser"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            has_email_verified=validated_data.get('has_email_verified', False)
        )
        return user

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email' # email field should be contained in token 

    def validate(self, attrs: Dict[str, Any]): # overridden default validation method to customize authentication process
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password')
        }
        user = authenticate(**credentials) # attempt to authenticate user
        if user:
            if not user.has_email_verified:
                raise exceptions.AuthenticationFailed(f'Failed to login: User\'s ({user.username}) email is not verified.')
            data = {}
            refresh = self.get_token(user)
            data['refresh'] = str(refresh)
            data['access'] = str(refresh.access_token)
            return data
        else:
            raise exceptions.AuthenticationFailed("Failed to validate token.")

# class CustomTokenRefreshSerializer(TokenRefreshSerializer):
#     def validate(self, attrs: Dict[str, Any]):
#         # return super().validate(attrs)