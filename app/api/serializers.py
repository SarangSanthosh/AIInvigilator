from rest_framework import serializers
from django.contrib.auth.models import User
from app.models import TeacherProfile, LectureHall, MalpraticeDetection


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_superuser']
        read_only_fields = ['id', 'is_superuser']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'phone', 'profile_picture']
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        phone = validated_data.pop('phone', None)
        profile_picture = validated_data.pop('profile_picture', None)
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create TeacherProfile
        TeacherProfile.objects.create(
            user=user,
            phone=phone or '',
            profile_picture=profile_picture
        )
        
        return user


class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    lecture_hall_name = serializers.CharField(source='lecture_hall.hall_name', read_only=True)
    lecture_hall_building = serializers.CharField(source='lecture_hall.building', read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = '__all__'


class LectureHallSerializer(serializers.ModelSerializer):
    assigned_teacher_name = serializers.CharField(source='assigned_teacher.username', read_only=True)
    
    class Meta:
        model = LectureHall
        fields = '__all__'


class MalpracticeDetectionSerializer(serializers.ModelSerializer):
    lecture_hall_name = serializers.CharField(source='lecture_hall.hall_name', read_only=True)
    lecture_hall_building = serializers.CharField(source='lecture_hall.building', read_only=True)
    
    class Meta:
        model = MalpraticeDetection
        fields = '__all__'
        read_only_fields = ['date', 'time']
