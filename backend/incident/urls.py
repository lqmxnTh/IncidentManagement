from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IncidentListCreateView,IncidentDetailView, ResolutionViewSet, EscalationHistoryViewSet

router = DefaultRouter()
router.register(r'resolutions', ResolutionViewSet)
router.register(r'escalations', EscalationHistoryViewSet)

urlpatterns = [
    path('incidents/', IncidentListCreateView.as_view(), name='incident_list_create'),
    path('incidents/<int:pk>/', IncidentDetailView.as_view(), name='incident_detail'),
    path('', include(router.urls)),
 ]
