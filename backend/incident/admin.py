from django.contrib import admin
from .models import Incident,Resolution,EscalationHistory,IncidentType
# Register your models here.
admin.site.register(Incident)
admin.site.register(Resolution)
admin.site.register(EscalationHistory)
admin.site.register(IncidentType)