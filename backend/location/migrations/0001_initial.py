# Generated by Django 4.2.9 on 2024-06-03 09:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('floor_number', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='CommonArea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Faculty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('building', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='location.building')),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('floor', models.IntegerField()),
                ('classroom', models.IntegerField()),
                ('specific_location', models.CharField(max_length=200)),
                ('building', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='location.building')),
                ('common_area', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='location.commonarea')),
                ('faculty', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='location.faculty')),
            ],
        ),
    ]
