from rest_framework import serializers
from .models import Incident, Resolution,EscalationHistory


class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = [
            'id', 
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
            'email'
            ]
        
class ResolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resolution
        fields = '__all__'

class EscalationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EscalationHistory
        fields = '__all__'