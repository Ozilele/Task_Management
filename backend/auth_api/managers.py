from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, username, email, password=None, **extra_kwargs):
        if not email:
            raise ValueError('The email must be set')
        if not username:
            raise ValueError('The username must be set')

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    """
    Create and save a SuperUser with the given email and password.
    """
    def create_superuser(self, username, email, password, **extra_kwargs):
        extra_kwargs.setdefault('is_staff', True)
        extra_kwargs.setdefault('is_superuser', True) # all permissions
        extra_kwargs.setdefault('is_active', True)

        if extra_kwargs.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_kwargs.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(username, email, password, **extra_kwargs)

    

