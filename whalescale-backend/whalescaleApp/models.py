from django.conf import settings
from django.contrib.auth.models import BaseUserManager, AbstractUser, User
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token


# Author: Thomas Chemmanoor
# File contains the database schema

class AccountManager(BaseUserManager):
    def create_user(self, username, password=None):
        if not username:
            raise ValueError("Users must have a username")

        user = self.model(
            username=username,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None):
        user = self.create_user(
            username=username,
            password=password,
        )
        user.is_admin = True;
        user.is_staff = True;
        user.is_superuser = True;
        user.save(using=self._db);
        return user


class Account(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now_add=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = AccountManager()

    def __str__(self):
        return self.username


class Image(models.Model):
    name = models.CharField(null=True, max_length=100)
    link = models.CharField(null=True, max_length=100)
    measured_link = models.CharField(null=True, max_length=100)
    focalLength = models.DecimalField(null=True, max_digits=15, decimal_places=5)
    altitude = models.DecimalField(null=True, max_digits=15, decimal_places=5)
    pixelDimension = models.DecimalField(null=True, max_digits=15, decimal_places=10)
    owner = models.ForeignKey(Account, null=True, on_delete=models.CASCADE)
    notes = models.CharField(null=True, max_length=250)


class Length(models.Model):
    name = models.CharField(null=True, max_length=100)
    length = models.DecimalField(null=True, max_digits=15, decimal_places=5)
    widthSegments = models.IntegerField(null=True)
    image = models.ForeignKey(Image, null=True, on_delete=models.CASCADE)
    bezierFit = models.BooleanField(null=True)


class Width(models.Model):
    width = models.DecimalField(null=True, max_digits=15, decimal_places=5)
    length = models.ForeignKey(Length, null=True, on_delete=models.CASCADE)


class Angle(models.Model):
    name = models.CharField(null=True, max_length=100)
    angle = models.DecimalField(null=True, max_digits=15, decimal_places=5)
    image = models.ForeignKey(Image, null=True, on_delete=models.CASCADE)


class Area(models.Model):
    name = models.CharField(null=True, max_length=100)
    area = models.DecimalField(null=True, max_digits=15, decimal_places=5)
    image = models.ForeignKey(Image, null=True, on_delete=models.CASCADE)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
