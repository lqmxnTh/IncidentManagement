# Generated by Django 4.2.9 on 2024-09-16 05:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('incident', '0012_remove_steps_attendees_alter_steps_step_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='incident',
            name='WorkFlow',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='incident.workflow'),
        ),
    ]