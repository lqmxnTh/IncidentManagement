from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='username', read_only=True)

    class Meta(object):
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['studentId', 'course', 'level', 'role']
        
class ProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user']
        extra_kwargs = {
            'studentId': {'required': False,'blank':True},
            'course': {'required': False,'blank':True},
            'level': {'required': False,'blank':True},
            'role': {'required': False,'blank':True},
        }

