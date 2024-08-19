from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IncidentListCreateView,ResolutionByIncidentViewSet,IncidentDetailView,SendAssignmentEmail,IncidentTypeListView, ResolutionViewSet, EscalationHistoryViewSet,IncidentListView

router = DefaultRouter()
router.register(r'resolutions', ResolutionViewSet)
router.register(r'escalations', EscalationHistoryViewSet)

urlpatterns = [
    path('incidents/', IncidentListCreateView.as_view(), name='incident_list_create'),
    path('view-only-incidents/', IncidentListView.as_view(), name='incident_list_view'),
    path('incidents/<int:pk>/', IncidentDetailView.as_view(), name='incident_detail'),
    path('incident-types/', IncidentTypeListView.as_view(), name='incident_types'),
    path('incidents/<int:incident_id>/send-mail/', SendAssignmentEmail.as_view(), name='send_assignment_email'),
    path('resolutions/incident/<int:incident_id>/', ResolutionByIncidentViewSet.as_view(), name='resolution-by-incident'),
    path('', include(router.urls)),
 ]
