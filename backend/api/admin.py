from django.contrib import admin
from .models import Profile,Role,Team,Department
# Register your models here.
admin.site.register(Profile)
admin.site.register(Role)
admin.site.register(Team)
admin.site.register(Department)