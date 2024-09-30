from tkinter import NO
from turtle import mode
from django.db import models
from api.models import Profile, Team
from location.models import Classroom, Faculty, Building
from django.forms import ValidationError
from django.contrib.auth.models import User


class IncidentType(models.Model):
    name = models.CharField(max_length=250)
    
    def __str__(self):
        return self.name
    
class Steps(models.Model):
    step = models.IntegerField(blank=True)
    name = models.TextField(blank=True)
    attendees = models.ForeignKey(Profile,blank=True,null=True,on_delete=models.CASCADE)
    category = models.ForeignKey(IncidentType,blank=True,null=True,on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Steps for {self.name} {self.category}'
    
class WorkFlow(models.Model):
    name = models.TextField(blank=True)
    created_by = models.ForeignKey(Profile,blank=True,null=True,on_delete=models.CASCADE)
    category = models.ForeignKey(IncidentType,blank=True,null=True,on_delete=models.CASCADE)
    steps = models.ManyToManyField(Steps,blank=True,default=None)
    emmergency = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Workflow for {self.name} {self.category.name}'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Ensure the category of each step is the same as the workflow's category
        if self.category and self.steps.exists():
            for step in self.steps.all():
                if step.category != self.category:
                    step.category = self.category
                    step.save()

class Incident(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Assign', 'Assign'),
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
    latitude = models.FloatField(null=True,blank=True)
    longitude = models.FloatField(null=True,blank=True)
    assigned_to = models.ManyToManyField(Profile,blank=True,default=None, related_name='assigned_incidents')
    accepted = models.ManyToManyField(Profile,blank=True,default=None, related_name='accepted')
    workflow = models.ForeignKey(WorkFlow,on_delete=models.CASCADE, blank=True, null=True)
    
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
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='resolutions')
    teams = models.ManyToManyField(Team, blank=True,default=None)
    resolution_notes = models.TextField()
    resolution_date = models.DateTimeField(auto_now_add=True)
    resolution_time = models.DurationField()

    def __str__(self):
        return f'Resolution {self.id} for {self.incident.title} - {self.resolution_notes}'
    
class EscalationHistory(models.Model):
    ESCALATION_TYPE_CHOICES = [
        ('Functional', 'Functional'),
        ('Hierarchical', 'Hierarchical'),
    ]

    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='escalation_history')
    escalated_by = models.ForeignKey(Profile, on_delete=models.CASCADE)
    escalated_to = models.ManyToManyField(Profile,blank=True,default=None, related_name="escalated_to")
    escalation_type = models.CharField(max_length=50, choices=ESCALATION_TYPE_CHOICES)
    previous_level = models.IntegerField()
    new_level = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    comments = models.TextField()

    def __str__(self):
        return f'Escalation for {self.incident.title}'

class Task(models.Model):
    name = models.CharField(max_length=200)
    incident = models.ForeignKey(Incident,blank=True,null=True,on_delete=models.CASCADE)
    created_by = models.ForeignKey(Profile,blank=True,null=True,on_delete=models.CASCADE)
    task_to = models.ForeignKey(Profile,blank=True,null=True,on_delete=models.CASCADE,  related_name="task_to")
    timestamp = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    forfeited = models.BooleanField(default=False)
    forfeited_reason = models.TextField(blank=True)
    step = models.IntegerField(blank=True)
    
    def __str__(self):
        return f'Task {self.name} {self.incident.title}'
    
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True,null=True)
    message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    read_status = models.BooleanField(default=False)
    link_path = models.CharField(max_length=255, blank=True)
    
