# Generated by Django 4.2.9 on 2024-06-03 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('location', '0002_remove_faculty_building_building_faculty'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='specific_location',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]