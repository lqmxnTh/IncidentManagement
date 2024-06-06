# Generated by Django 4.2.9 on 2024-06-04 20:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_profile_course_alter_profile_level_and_more'),
        ('incident', '0008_remove_incident_team_resolution_escalationhistory'),
    ]

    operations = [
        migrations.CreateModel(
            name='IncidentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
            ],
        ),
        migrations.AddField(
            model_name='incident',
            name='escalation_level',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='incident',
            name='priority',
            field=models.CharField(choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High'), ('Critical', 'Critical')], default='Low', max_length=50),
        ),
        migrations.AlterField(
            model_name='incident',
            name='status',
            field=models.CharField(blank=True, choices=[('Open', 'Open'), ('In Progress', 'In Progress'), ('Resolved', 'Resolved'), ('Closed', 'Closed'), ('Escalated', 'Escalated')], default='Open', max_length=20, null=True),
        ),
        migrations.RemoveField(
            model_name='resolution',
            name='resolved_by',
        ),
        migrations.AddField(
            model_name='incident',
            name='incident_type',
            field=models.ManyToManyField(blank=True, default=None, to='incident.incidenttype'),
        ),
        migrations.AddField(
            model_name='resolution',
            name='resolved_by',
            field=models.ManyToManyField(blank=True, default=None, to='api.team'),
        ),
    ]
