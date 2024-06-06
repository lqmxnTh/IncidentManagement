from django.urls import path
from .views import (
    UserRegisterView, UserLoginView
)

urlpatterns = [
    path('register/', UserRegisterView),
    path('login/', UserLoginView),
]