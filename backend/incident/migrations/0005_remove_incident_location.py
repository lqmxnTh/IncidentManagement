# Generated by Django 4.2.9 on 2024-06-04 14:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('incident', '0004_alter_incident_team_alter_incident_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='incident',
            name='location',
        ),
    ]
