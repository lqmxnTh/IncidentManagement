from django.contrib import admin
from .models import Building,Faculty,CommonArea,Location,Classroom
# Register your models here.
admin.site.register(Building)
admin.site.register(Faculty)
admin.site.register(CommonArea)
admin.site.register(Location)
admin.site.register(Classroom)