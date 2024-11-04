from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import UserLoginView, UserRegisterView, test_token,GroupViewSetByUser, UserViewSet, GroupViewSet, PermissionViewSet, ProfileDetailView,ProfileDetailViewUserId, ProfileListView, RoleListView, RoleDetailView, DepartmentListView, DepartmentDetailView, TeamListView, TeamDetailView
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'permissions', PermissionViewSet)
router.register(r'user-groups', GroupViewSetByUser, basename='user-group')
urlpatterns = [
    path('login/', UserLoginView, name='login'),
    path('register/', UserRegisterView, name='register'),
    path('test-token/', test_token, name='test-token'),
    path('profiles/', ProfileListView.as_view(), name='profile-list'),
    path('profiles/<int:pk>/', ProfileDetailView.as_view(), name='profile-detail'),
    path('profiles/user/<int:user_id>/', ProfileDetailViewUserId.as_view(), name='profile-detail'),
    path('roles/', RoleListView.as_view(), name='role-list'),
    path('roles/<int:pk>/', RoleDetailView.as_view(), name='role-detail'),
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('departments/<int:pk>/', DepartmentDetailView.as_view(), name='department-detail'),
    path('teams/', TeamListView.as_view(), name='team-list'),
    path('teams/<int:pk>/', TeamDetailView.as_view(), name='team-detail'),
    path('', include(router.urls)),
]
