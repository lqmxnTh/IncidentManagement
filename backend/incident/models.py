from django.db import models
from api.models import Profile, Team
from location.models import Classroom, Faculty, Building
from django.forms import ValidationError
from django.contrib.auth.models import User
class IncidentType(models.Model):
    name = models.CharField(max_length=250)
    
    def __str__(self):
        return self.name

class Incident(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
        ('Closed', 'Closed'),
        ('Escalated', 'Escalated'),
        ('Rejected', 'Rejected'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    ]

    profile = models.ForeignKey(Profile, blank=True, null=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, blank=True, null=True)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, blank=True, null=True)
    building = models.ForeignKey(Building, on_delete=models.CASCADE, blank=True, null=True)
    floor = models.IntegerField(null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True, null=True,default='Open')
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, default='Low')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    escalation_level = models.IntegerField(default=0)
    email = models.CharField(null=True, blank=True, max_length=250)
    incident_type = models.ManyToManyField(IncidentType,blank=True,default=None)
    teams = models.ManyToManyField(Team,blank=True,default=None)
    
    def __str__(self):
        return self.title

    def clean(self):
        if self.floor is not None and self.building is not None:
            if self.floor < 0 or self.floor > self.building.floor_number:
                raise ValidationError(f'Floor must be between 0 and {self.building.floor_number}')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class Resolution(models.Model):
    incident = models.OneToOneField(Incident, on_delete=models.CASCADE, related_name='resolution')
    resolved_by = models.ManyToManyField(Team, blank=True,default=None)
    resolution_notes = models.TextField()
    resolution_date = models.DateTimeField(auto_now_add=True)
    resolution_time = models.DurationField()

    def __str__(self):
        return f'Resolution for {self.incident.title}'

class EscalationHistory(models.Model):
    ESCALATION_TYPE_CHOICES = [
        ('Functional', 'Functional'),
        ('Hierarchical', 'Hierarchical'),
    ]

    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='escalation_history')
    escalated_by = models.ForeignKey(Profile, on_delete=models.CASCADE)
    escalation_type = models.CharField(max_length=50, choices=ESCALATION_TYPE_CHOICES)
    previous_level = models.IntegerField()
    new_level = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    comments = models.TextField()

    def __str__(self):
        return f'Escalation for {self.incident.title}'
