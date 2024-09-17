from cv2 import FACE_RECOGNIZER_SF_FR_COSINE
from rest_framework import serializers
from .models import Incident, Resolution,EscalationHistory,IncidentType, Steps, Task, WorkFlow
from api.models import *
from location.models import *
from django.contrib.auth.models import User
from api.serializers import ProfileSerializer

# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = ['id','profile', 'user', 'studentId', 'course', 'level', 'role']  # Add other fields as needed

class IncidentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentType
        fields = '__all__'
        
class StepsViewOnlySerializer(serializers.ModelSerializer):
    attendees = ProfileSerializer(read_only=True)
    category = IncidentTypeSerializer(read_only=True)

    class Meta:
        model = Steps
        fields = '__all__'
            
class StepsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Steps
        fields = ['step', 'name', 'attendees', 'category']
    
    def create(self, validated_data):
        # Create the step instance
        step = Steps.objects.create(**validated_data)
        
        # Get the workflow from context (you will pass it in the view)
        workflow = self.context['workflow']
        
        # Add the newly created step to the workflow
        workflow.steps.add(step)
        
        return step
            
class WorkFlowSerializer(serializers.ModelSerializer):
    # steps = StepsSerializer(many=True, read_only=False)
    created_by = ProfileSerializer(read_only=True)
    # category = IncidentTypeSerializer(read_only=False)
    number_of_steps = serializers.SerializerMethodField()

    class Meta:
        model = WorkFlow
        fields = '__all__'
        
    def get_number_of_steps(self, obj):
        return obj.steps.count()
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email']

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ['id', 'number']  # Add other fields as needed

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ['id', 'name']  # Add other fields as needed

class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = ['id', 'name']  # Add other fields as needed

class AdvanceIncidentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_first_name = serializers.SerializerMethodField()
    classroom_name = serializers.SerializerMethodField()
    faculty_name = serializers.SerializerMethodField()
    building_name = serializers.SerializerMethodField()
    formatted_created_at = serializers.SerializerMethodField()
    formatted_updated_at = serializers.SerializerMethodField()
    class Meta:
        model = Incident
        fields = [
            'id', 
            'profile',
            'user',
            'user_name',
            'user_first_name',
            'classroom',
            'classroom_name',
            'faculty',
            'faculty_name',
            'building',
            'building_name',
            'floor',
            'title', 
            'description',
            'created_at', 
            'updated_at',
            'formatted_created_at',
            'formatted_updated_at',
            'status',
            'priority',
            'email',
            'escalation_level',
            'incident_type',
            'teams',
            'latitude',
            'longitude',
            'assigned_to',
            'accepted',
            'workflow',
        ]

    def get_user_name(self, obj):
        return obj.user.username if obj.user else None

    def get_user_first_name(self, obj):
        return obj.user.first_name if obj.user else None

    def get_classroom_name(self, obj):
        return obj.classroom.number if obj.classroom else None

    def get_faculty_name(self, obj):
        return obj.faculty.name if obj.faculty else None

    def get_building_name(self, obj):
        return obj.building.name if obj.building else None

    def get_formatted_created_at(self, obj):
        return obj.created_at.strftime("%d/%m/%Y")

    def get_formatted_updated_at(self, obj):
        return obj.updated_at.strftime("%d/%m/%Y")








class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = [
            'id', 
            'profile',
            'user',
            'title', 
            'description',
            'created_at', 
            'updated_at',
            'floor',
            'faculty',
            'building',
            'classroom',
            'status',
            'email',
            'teams',
            'latitude',
            'longitude',
            'assigned_to',
            'accepted',
            'worflow',
            ]

class ResolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resolution
        fields = '__all__'

class EscalationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EscalationHistory
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        

    
    