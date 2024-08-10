from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Incident, Resolution, EscalationHistory,IncidentType, Profile
from .serializers import IncidentSerializer, ProfileSerializer, ResolutionSerializer,IncidentTypeSerializer, EscalationHistorySerializer,AdvanceIncidentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


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
    
# class TeamMembersView(APIView):
#     def post(self, request):
#         team_ids = request.data.get('team_ids', [])
        
#         if not team_ids:
#             return Response({"error": "No team IDs provided."}, status=status.HTTP_400_BAD_REQUEST)
        
#         members = Profile.objects.filter(teams__in=team_ids).distinct()
#         serializer = ProfileSerializer(members, many=True)
        
#         return Response(serializer.data, status=status.HTTP_200_OK)