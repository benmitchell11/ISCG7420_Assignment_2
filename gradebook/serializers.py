# serializers.py
import pandas
import logging
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Semester, Lecturer, Student, Class, StudentEnrolment

logger = logging.getLogger(__name__)


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'id', 'password']


class LecturerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Lecturer
        fields = ['user', 'dob', 'course', 'id']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        lecturer = Lecturer.objects.create(user=user, **validated_data)
        return lecturer

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_instance = instance.user
            for attr, value in user_data.items():
                setattr(user_instance, attr, value)
            user_instance.save()

        instance.dob = validated_data.get('dob', instance.dob)
        instance.save()
        return instance


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Student
        fields = ['user', 'dob', 'id']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        student = Student.objects.create(user=user, **validated_data)
        return student

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_instance = instance.user
            for attr, value in user_data.items():
                setattr(user_instance, attr, value)
            user_instance.save()

        instance.dob = validated_data.get('dob', instance.dob)
        instance.save()
        return instance


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def create(self, validated_data):
        excel_file = validated_data['file']
        df = pandas.read_excel(excel_file)

        students = []
        for index, row in df.iterrows():
            # Assuming column names in Excel are 'Username', 'First Name', 'Last Name', 'DOB'
            email = row['email']
            username = row['email']
            first_name = row['first_name']
            last_name = row['last_name']
            dob = row['dob']

            # Create or get the User object
            user, created = User.objects.get_or_create(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                password="Student123")

            # Create the Student object
            student = Student.objects.create(user=user, dob=dob)
            students.append(student)

        return students  # Return uploaded student instances if needed


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'


class StudentEnrolmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentEnrolment
        fields = '__all__'




class AdminSignInSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
