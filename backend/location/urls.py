from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FacultyViewSet, BuildingViewSet, ClassroomViewSet

router = DefaultRouter()
router.register(r'faculties', FacultyViewSet)
router.register(r'buildings', BuildingViewSet)
router.register(r'classrooms', ClassroomViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
