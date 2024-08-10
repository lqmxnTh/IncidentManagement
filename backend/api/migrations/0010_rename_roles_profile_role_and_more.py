# Generated by Django 4.2.9 on 2024-08-10 05:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_role_profile_roles_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='roles',
            new_name='role',
        ),
        migrations.RenameField(
            model_name='team',
            old_name='departments',
            new_name='department',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='is_staff',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='teams',
        ),
        migrations.AddField(
            model_name='team',
            name='members',
            field=models.ManyToManyField(related_name='teams', to='api.profile'),
        ),
    ]