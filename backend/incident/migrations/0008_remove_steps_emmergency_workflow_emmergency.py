# Generated by Django 4.2.9 on 2024-09-12 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incident', '0007_steps_emmergency'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='steps',
            name='emmergency',
        ),
        migrations.AddField(
            model_name='workflow',
            name='emmergency',
            field=models.BooleanField(default=False),
        ),
    ]
