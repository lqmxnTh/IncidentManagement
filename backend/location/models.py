from django.db import models
from django.forms import ValidationError

# Create your models here.

    
class Faculty(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Building(models.Model):
    name = models.CharField(max_length=100)
    floor_number = models.IntegerField()
    faculty = models.ForeignKey(Faculty,on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
class Classroom(models.Model):
    number = models.CharField(max_length=7)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    floor = models.IntegerField()  # Floor number

    def __str__(self):
        return f'{self.number} - Floor {self.floor} - {self.building.name}'

    def clean(self):
        # Ensure the floor number is within the valid range
        if self.floor < 0 or self.floor > self.building.floor_number:
            raise ValidationError(f'Floor must be between 1 and {self.building.floor_number}')

    def save(self, *args, **kwargs):
        self.clean()  # Call clean to validate before saving
        super(Classroom, self).save(*args, **kwargs)

    

class CommonArea(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Location(models.Model):
    common_area = models.ForeignKey(CommonArea, on_delete=models.CASCADE, null=True, blank=True)
    specific_location = models.CharField(max_length=200,null=True,blank=True)

    def __str__(self):
        return f'{self.specific_location} - {self.common_area}'

