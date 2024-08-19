from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Role, Department, Team, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email']
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
    user_name = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['id','user','user_name','role','staff']
    
    def get_user_name(self, obj):
        return obj.user.username if obj.user else None
        
class ProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user']
        extra_kwargs = {
            'role': {'required': False,'blank':True},
        }

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class TeamSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=Profile.objects.all())
    department = serializers.PrimaryKeyRelatedField(many=True, queryset=Department.objects.all())

    class Meta:
        model = Team
        fields = ['id', 'name', 'members', 'department']
