# Generated by Django 4.2.9 on 2024-09-12 09:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
        ('incident', '0002_rename_profile_task_created_by_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='task_to',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task_to', to='api.profile'),
        ),
    ]
