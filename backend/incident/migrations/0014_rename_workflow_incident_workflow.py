# Generated by Django 4.2.9 on 2024-09-16 05:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('incident', '0013_incident_workflow'),
    ]

    operations = [
        migrations.RenameField(
            model_name='incident',
            old_name='WorkFlow',
            new_name='workFlow',
        ),
    ]