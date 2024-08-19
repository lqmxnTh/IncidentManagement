from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Incident, Resolution, EscalationHistory,IncidentType, Profile, Task
from .serializers import IncidentSerializer, ProfileSerializer, ResolutionSerializer,IncidentTypeSerializer, EscalationHistorySerializer,AdvanceIncidentSerializer, TaskSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
import smtplib
# Create your views here.
class IncidentListCreateView(generics.ListCreateAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    # permission_classes = [IsAuthenticated]

class IncidentListView(generics.ListAPIView):
    queryset = Incident.objects.all()
    serializer_class = AdvanceIncidentSerializer    

class IncidentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Incident.objects.all()
    serializer_class = AdvanceIncidentSerializer
    # permission_classes = [IsAuthenticated]
    
class ResolutionViewSet(viewsets.ModelViewSet):
    queryset = Resolution.objects.all()
    serializer_class = ResolutionSerializer
    
class ResolutionByIncidentViewSet(generics.ListAPIView):
    serializer_class = ResolutionSerializer

    def get_queryset(self):
        incident_id = self.kwargs['incident_id']
        return Resolution.objects.filter(incident_id=incident_id)
    
class EscalationHistoryViewSet(viewsets.ModelViewSet):
    queryset = EscalationHistory.objects.all()
    serializer_class = EscalationHistorySerializer
    
class IncidentTypeListView(generics.ListAPIView):
    queryset = IncidentType.objects.all()
    serializer_class = IncidentTypeSerializer

class TaskListView(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
    
class SendAssignmentEmail(APIView):
    def post(self, request, incident_id):
        try:
            # Fetch incident details
            incident = Incident.objects.get(id=incident_id)
            
            # Assume incident.assigned_to is a list of profiles
            assigned_profiles = incident.assigned_to.all()
            if not assigned_profiles:
                return JsonResponse({"error": "No Assigned Members yet"}, status=400)
            
            # Prepare the email content
            subject = f"Incident {incident.title} Assignment"
            message = f"You have been assigned to the incident: {incident.title}.\n\nDescription:\n{incident.description}"
            from_email = settings.EMAIL_HOST_USER
            
            # Collect all recipient addresses
            recipient_list = [profile.user.username for profile in assigned_profiles]
            
            # Validate recipient email addresses
            try:
                # Try sending a test email to validate addresses
                send_mail(subject, message, from_email, recipient_list)
            except smtplib.SMTPRecipientsRefused:
                return JsonResponse({"error": "One or more email addresses are incorrect"}, status=400)
            
            # If all email addresses are valid, send emails
            for profile in assigned_profiles:
                recipient_list = [profile.user.username]
                try:
                    send_mail(subject, message, from_email, recipient_list)
                except smtplib.SMTPRecipientsRefused:
                    return JsonResponse({"error": f"Email address for {profile.user.username} is incorrect"}, status=400)
            
            return JsonResponse({"message": "Emails sent successfully"}, status=200)
        
        except Incident.DoesNotExist:
            return JsonResponse({"error": "Incident not found"}, status=404)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)