from django.urls import path
from .views import UserLoginView, UserRegisterView, test_token, ProfileListView, RoleListView, RoleDetailView, DepartmentListView, DepartmentDetailView, TeamListView, TeamDetailView

urlpatterns = [
    path('login/', UserLoginView, name='login'),
    path('register/', UserRegisterView, name='register'),
    path('test-token/', test_token, name='test-token'),
    path('profiles/', ProfileListView.as_view(), name='profile-list'),
    path('roles/', RoleListView.as_view(), name='role-list'),
    path('roles/<int:pk>/', RoleDetailView.as_view(), name='role-detail'),
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('departments/<int:pk>/', DepartmentDetailView.as_view(), name='department-detail'),
    path('teams/', TeamListView.as_view(), name='team-list'),
    path('teams/<int:pk>/', TeamDetailView.as_view(), name='team-detail'),
]
