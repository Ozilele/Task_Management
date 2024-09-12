from rest_framework import permissions, generics, status, authentication
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserModelSerializer, CustomTokenObtainPairSerializer
from .models import CustomUser
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserModelSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save(has_email_verified=False)
        token = default_token_generator.make_token(user) # creating token which consist of a timestamp and HMAC value - secret key is settings.SECRET_KEYto get unique value, hash combines values such as user's pk, hashed passw, last login, curr timestamp 
        uid = urlsafe_base64_encode(force_bytes(user.username)) # base64 encoding for username
        current_site = get_current_site(self.request)
        print(f'curr_domain: {current_site.domain}')
        mail_subject = "Activate your account"
        message = render_to_string('activation.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': uid,
            'token': token
        })
        my_recipient = "ozili1@wp.pl"
        with mail.get_connection() as connection:
            mail_to_send = mail.EmailMessage(
                mail_subject,
                message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[my_recipient],
                connection=connection,
            )
            mail_to_send.send()
        return Response({"message": "Please confirm your email to complete registration."})
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer # custom serializer used for token generation

# class CustomTokenRefreshView(TokenRefreshView):
#     serializer_class = CustomTokenRefreshSerializer # custom token refresh serializer for generating access token based on refresh token

class ActivateAccount(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(username=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist) as e:
            print(f'Exception arrised during base64 decoding uid, {e.__str__}')
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            if user.has_email_verified:
                return Response({'message': 'This activation link has already been used.'}, status=status.HTTP_400_BAD_REQUEST)
            user.has_email_verified = True
            user.save()
            return Response({'message': "Thank you for confirming your email. Now you can login in."}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Activation link is invalid!'}, status=status.HTTP_400_BAD_REQUEST)