from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

from .models import Incident, Resolution, EscalationHistory,IncidentType, Profile, Steps, Task, WorkFlow
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import Settings, settings
from django.http import JsonResponse
import smtplib
from django.views.decorators.csrf import csrf_exempt
import joblib
import numpy as np
import json
from django.db.models import Count
from django.db.models.functions import TruncDate

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
    
class EscalationByIncidentViewSet(generics.ListAPIView):
    serializer_class = EscalationHistorySerializer

    def get_queryset(self):
        incident_id = self.kwargs['incident_id']
        return EscalationHistory.objects.filter(incident_id=incident_id)
    
class EscalationHistoryViewSet(viewsets.ModelViewSet):
    queryset = EscalationHistory.objects.all()
    serializer_class = EscalationHistorySerializer
    
class IncidentTypeListView(generics.ListAPIView):
    queryset = IncidentType.objects.all()
    serializer_class = IncidentTypeSerializer

class TaskListView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class StepsListViewONLY(generics.ListAPIView):
    queryset = Steps.objects.all()
    serializer_class = StepsViewOnlySerializer  
    
class StepsListCreateView(generics.ListCreateAPIView):
    queryset = Steps.objects.all()
    serializer_class = StepsCreateSerializer  

class IndividualStepsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Steps.objects.all()
    serializer_class = StepsCreateSerializer  

class WorkFlowListView(generics.ListCreateAPIView):
    queryset = WorkFlow.objects.all()
    serializer_class = WorkFlowSerializer  
    
class WorkFlowDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = WorkFlow.objects.all()
    serializer_class = WorkFlowSerializer
    
class AddStepToWorkflowView(APIView):
    def post(self, request, workflow_id):
        workflow = WorkFlow.objects.get(id=workflow_id)
        
        serializer = StepsCreateSerializer(data=request.data, context={'workflow': workflow})
        
        if serializer.is_valid():
            step = serializer.save()
            return Response({'status': 'Step added', 'step': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StepsByWorkflowView(generics.ListAPIView):
    serializer_class = StepsViewOnlySerializer
    
    def get_queryset(self):
        workflow_id = self.kwargs['workflow_id']
        try:
            workflow = WorkFlow.objects.get(id=workflow_id)
            return workflow.steps.all()  # Return the steps related to the workflow
        except WorkFlow.DoesNotExist:
            return Steps.objects.none()  # Return empty queryset if workflow not found

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"detail": "Workflow not found or no steps available."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class TasksByIncidentView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        incident_id = self.kwargs['incident_id']
        return Task.objects.filter(incident_id=incident_id) 
    
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
        

# model = joblib.load(settings.MODEL)

# class PredictAPIView(APIView):
#     def __init__(self, **kwargs):
#         super().__init__(**kwargs)
#         # Load or initialize your vectorizer
#         # For example, if you used a TfidfVectorizer during training, load it here
#         self.vectorizer = self.load_vectorizer()

#     def load_vectorizer(self):
#         # Load the pre-trained vectorizer from a file or any other source
#         # For example, if you saved the vectorizer using joblib or pickle:
#         return joblib.load(settings.VECTORIZER)

#     def post(self, request, *args, **kwargs):
#         try:
#             # Get the text from the request body
#             data = json.loads(request.body)
#             text = data.get('text')

#             if not text:
#                 return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

#             # Preprocess the text to convert it into numeric format
#             processed_text = self.preprocess_text(text)  # This should convert text to numeric format

#             # Reshape if needed for the model
#             reshaped_text = np.array([processed_text]).reshape(1, -1)

#             # Make prediction
#             prediction = model.predict(reshaped_text)

#             return Response({'prediction': prediction.tolist()}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#     def preprocess_text(self, text):
#         # Convert the text to numeric format using the loaded vectorizer
#         return self.vectorizer.transform([text]).toarray()[0]

import xgboost as xgb
import string
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

model = xgb.Booster()
model.load_model(settings.MODEL)
tfidf_vectorizer = joblib.load(settings.VECTORIZER)
label_encoder = joblib.load(settings.LABELENCODER)

import re

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    tokens = text.split()
    return ' '.join(tokens)

class PredictAPIView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            description = data.get('description')
            cleaned_description = preprocess_text(description)
            description_tfidf = tfidf_vectorizer.transform([cleaned_description])
            dmatrix = xgb.DMatrix(description_tfidf)
            prediction = model.predict(dmatrix)
            predicted_class_index = int(prediction[0])
            predicted_category = label_encoder.inverse_transform([predicted_class_index])[0]
            return JsonResponse({'predicted_category': predicted_category})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

class IncidentPerDayView(APIView):
    def get(self, request, *args, **kwargs):
        incidents_per_day = (
            Incident.objects.annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        # Format data for the line chart
        data = {
            'dates': [entry['date'] for entry in incidents_per_day],
            'counts': [entry['count'] for entry in incidents_per_day],
        }

        return Response(data)

class IncidentTypeCountAPIView(APIView):
    """
    API view to count incidents by type.
    """
    def get(self, request, *args, **kwargs):
        # Use annotate to count incidents related to each IncidentType
        incident_counts = IncidentType.objects.annotate(
            count=Count('incident', distinct=True)  # Counting distinct incidents per incident type
        ).order_by('-count')

        # Prepare the response data
        counts_dict = {incident_type.name: incident_type.count for incident_type in incident_counts}

        # Return the data as a JSON response
        return Response(counts_dict, status=status.HTTP_200_OK)
    
class IncidentMetricsAPIView(APIView):
    """
    API view to count incidents by priority and status.
    """
    def get(self, request, *args, **kwargs):
        # Count incidents by priority
        priority_counts = Incident.objects.values('priority').annotate(
            count=Count('id')
        ).order_by('-count')

        # Count incidents by status
        status_counts = Incident.objects.values('status').annotate(
            count=Count('id')
        ).order_by('-count')

        # Prepare the response data
        priority_dict = {item['priority']: item['count'] for item in priority_counts}
        status_dict = {item['status']: item['count'] for item in status_counts}

        response_data = {
            'priority_counts': priority_dict,
            'status_counts': status_dict
        }

        # Return the data as a JSON response
        return Response(response_data, status=status.HTTP_200_OK)
    
class UnreadNotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        user = self.kwargs['user_id']
        return Notification.objects.filter(user_id=user,read_status=False)

class NotificationsCreateView(generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class NotificationsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer