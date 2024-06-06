from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Incident, Resolution, EscalationHistory,IncidentType
from .serializers import IncidentSerializer, ResolutionSerializer,IncidentTypeSerializer, EscalationHistorySerializer,AdvanceIncidentSerializer

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