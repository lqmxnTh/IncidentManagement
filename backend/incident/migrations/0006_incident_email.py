# Generated by Django 4.2.9 on 2024-06-04 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incident', '0005_remove_incident_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='incident',
            name='email',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]