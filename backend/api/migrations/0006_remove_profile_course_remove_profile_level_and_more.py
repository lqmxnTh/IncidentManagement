# Generated by Django 4.2.9 on 2024-07-24 13:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_profile_role_alter_team_department'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='course',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='level',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='studentId',
        ),
    ]