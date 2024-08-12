from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Incident, Resolution, EscalationHistory,IncidentType, Profile
from .serializers import IncidentSerializer, ProfileSerializer, ResolutionSerializer,IncidentTypeSerializer, EscalationHistorySerializer,AdvanceIncidentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
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

class EscalationHistoryViewSet(viewsets.ModelViewSet):
    queryset = EscalationHistory.objects.all()
    serializer_class = EscalationHistorySerializer
    
class IncidentTypeListView(generics.ListAPIView):
    queryset = IncidentType.objects.all()
    serializer_class = IncidentTypeSerializer

class SendAssignmentEmail(APIView):
    def post(self, request, incident_id):
        if request.method == 'POST':
            # Fetch incident details
            incident = Incident.objects.get(id=incident_id)
            
            # Assume incident.assigned_to is a list of profiles
            assigned_profiles = incident.assigned_to.all()
            
            # Prepare the email content
            subject = f"Incident {incident.title} Assignment"
            message = f"You have been assigned to the incident: {incident.title}.\n\nDescription:\n{incident.description}"
            from_email = settings.EMAIL_HOST_USER
            
            # Send an email to each assigned member
            for profile in assigned_profiles:
                recipient_list = [profile.user.username]
                send_mail(subject, message, from_email, recipient_list)
            
            return JsonResponse({"message": "Emails sent successfully"}, status=200)
        return JsonResponse({"error": "Invalid request"}, status=400)