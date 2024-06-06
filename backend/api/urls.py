from django.urls import path
from .views import (
    UserRegisterView, UserLoginView,ProfileListView
)

urlpatterns = [
    path('register/', UserRegisterView),
    path('login/', UserLoginView),
    path('profiles/', ProfileListView.as_view(), name='profiles'),
]