from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile
from .serializers import ProfileCreateSerializer

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile_data = {'user': instance.id}  # Assuming 'user' is the only required field in the ProfileSerializer
        serializer = ProfileCreateSerializer(data=profile_data)
        if serializer.is_valid():
            serializer.save()

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except Profile.DoesNotExist:
        # Handle the case where profile doesn't exist
        pass
