from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
router = DefaultRouter()
router.register(r'resolutions', ResolutionViewSet)
router.register(r'escalations', EscalationHistoryViewSet)

urlpatterns = [
    path('incidents/', IncidentListCreateView.as_view(), name='incident_list_create'),
    path('view-only-incidents/', IncidentListView.as_view(), name='incident_list_view'),
    path('incidents/<int:pk>/', IncidentDetailView.as_view(), name='incident_detail'),
    path('incident-types/', IncidentTypeListView.as_view(), name='incident_types'),
    path('incidents/<int:incident_id>/send-mail/', SendAssignmentEmail.as_view(), name='send_assignment_email'),
    path('incident/predict/', PredictAPIView.as_view(), name='predict'),
    path('incidents/<int:incident_id>/tasks/', TasksByIncidentView.as_view(), name='tasks-by-incident'),
    path('resolutions/incident/<int:incident_id>/', ResolutionByIncidentViewSet.as_view(), name='resolution-by-incident'),
    path('escalations/incident/<int:incident_id>/', EscalationByIncidentViewSet.as_view(), name='escalation-by-incident'),
    path('incidents-per-day/', IncidentPerDayView.as_view(), name='incidents-per-day'),
    path('incident-type-counts/', IncidentTypeCountAPIView.as_view(), name='incident_type_counts'),
    path('incident-metrics/', IncidentMetricsAPIView.as_view(), name='incident_metrics'),
    path('tasks/', TaskListView.as_view(), name='incident_tasks'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='incident_tasks'),
    path('view-only-steps/', StepsListViewONLY.as_view(), name='steps'),
    path('steps/', StepsListCreateView.as_view(), name='steps'),
    path('workflows/<int:workflow_id>/steps/', StepsByWorkflowView.as_view(), name='steps-by-workflow'),
    path('workflow/<int:workflow_id>/add_step/', AddStepToWorkflowView.as_view(), name='add_step_to_workflow'),
    path('update-steps/<int:pk>/', IndividualStepsView.as_view(), name='steps'),
    path('workflows/', WorkFlowListView.as_view(), name='workflow'),
    path('workflows/<int:pk>/', WorkFlowDetailView.as_view(), name='workflow-detail'),
    path('', include(router.urls)),
 ]
