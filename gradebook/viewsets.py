from django.contrib.auth import login
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password, make_password
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, status, filters
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

from .models import Course, Semester, Lecturer, Student, Class, StudentEnrolment, User
from .serializers import CourseSerializer, SemesterSerializer, LecturerSerializer, StudentSerializer, ClassSerializer, \
    StudentEnrolmentSerializer, FileUploadSerializer
import pandas


class FileUploadViewSet(viewsets.ViewSet):

    def create(self, request):
        serializer = FileUploadSerializer(data=request.data)

        if serializer.is_valid():
            try:

                students_data = serializer.validated_data.get('students')

                for student_data in students_data:
                    student_data['password'] = make_password(student_data.get('password'))

                students = Student.objects.bulk_create([Student(**data) for data in students_data])

                return Response({'message': 'Students uploaded successfully'}, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer


class LecturerViewSet(viewsets.ModelViewSet):
    serializer_class = LecturerSerializer

    def get_queryset(self):
        queryset = Lecturer.objects.all()
        course_id = self.request.query_params.get('course', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    @action(detail=False, methods=['get'])
    def get_by_course(self, request):
        course_id = request.query_params.get('course', None)
        if course_id is None:
            return Response({'error': 'Missing course query parameter'}, status=status.HTTP_400_BAD_REQUEST)

        lecturers = self.get_queryset().filter(course_id=course_id)
        serializer = self.get_serializer(lecturers, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):

        password = request.data.get('user', {}).get('password')

        hashed_password = make_password(password)

        request.data['user']['password'] = hashed_password

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'])
    def delete_by_user_id(self, request):
        user_id = request.query_params.get('user.id')
        if user_id:
            try:
                lecturer = self.get_queryset().get(user__id=user_id)
                self.perform_destroy(lecturer)
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Lecturer.DoesNotExist:
                return Response({"error": "Lecturer not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "user.id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['put'])
    def update_by_user_id(self, request):
        user_id = request.query_params.get('user.id')
        if not user_id:
            return Response({'error': 'Missing user.id in query params'}, status=400)

        try:
            instance = Lecturer.objects.get(user_id=user_id)
        except Lecturer.DoesNotExist:
            return Response({'error': 'Lecturer not found'}, status=404)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__id']
    permission_classes = []

    def create(self, request, *args, **kwargs):

        password = request.data.get('user', {}).get('password')

        hashed_password = make_password(password)

        request.data['user']['password'] = hashed_password

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user.id')
        if user_id:
            queryset = queryset.filter(user__id=user_id)
        return queryset

    @action(detail=False, methods=['delete'])
    def delete_by_user_id(self, request):
        user_id = request.query_params.get('user.id')
        if user_id:
            try:
                student = self.get_queryset().get(user__id=user_id)
                self.perform_destroy(student)
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Student.DoesNotExist:
                return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "user.id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['put'])
    def update_by_user_id(self, request):
        user_id = request.query_params.get('user.id')
        if not user_id:
            return Response({'error': 'Missing user.id in query params'}, status=400)

        try:
            instance = Student.objects.get(user_id=user_id)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)
        return Response(serializer.data)


class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    @action(detail=False, methods=['get'], url_path='lecturer-classes')
    def get_lecturer_classes(self, request):
        user = request.user
        try:
            lecturer = Lecturer.objects.get(user=user)
            classes = Class.objects.filter(lecturer=lecturer)
            serializer = self.get_serializer(classes, many=True)
            return Response(serializer.data)
        except Lecturer.DoesNotExist:
            return Response({'detail': 'Lecturer not found.'}, status=404)


class StudentEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = StudentEnrolment.objects.all()
    serializer_class = StudentEnrolmentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        class_id = self.request.query_params.get('classID')
        if class_id:
            queryset = queryset.filter(classID=class_id)
        return queryset


    @action(detail=False, methods=['get'])
    def get_by_student_id_and_class_id(self, request):
        print(request.query_params)
        student_id = request.query_params.get('student_id')
        class_id = request.query_params.get('classID')

        print(f"student_id: {student_id}, classID: {class_id}")

        if not student_id or not class_id:
            return Response({'error': 'Both student_id and class_id query parameters are required'},
                            status=status.HTTP_400_BAD_REQUEST)


        logger.debug(f"Received student_id: {student_id}, classID: {class_id}")

        try:
            student_enrollment = StudentEnrolment.objects.get(student_id=student_id, classID=class_id)
            serializer = self.get_serializer(student_enrollment)
            return Response(serializer.data)
        except StudentEnrolment.DoesNotExist:
            return Response({'error': 'Student enrollment not found for the given student_id and class_id'},
                            status=status.HTTP_404_NOT_FOUND)


class AdminLoginViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None and user.is_superuser:
            login(request, user)
            return Response({'message': 'Admin login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials or not authorized'}, status=status.HTTP_401_UNAUTHORIZED)


class LecturerLoginViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            try:
                lecturer = Lecturer.objects.get(user=user)
                login(request, user)
                return Response({'message': 'Lecturer login successful'}, status=status.HTTP_200_OK)
            except Lecturer.DoesNotExist:
                return Response({'error': 'User is not a lecturer'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Invalid credentials or not authorized'}, status=status.HTTP_401_UNAUTHORIZED)


class StudentLoginViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            try:
                student = Student.objects.get(user=user)
                login(request, user)
                return Response({'message': 'Lecturer login successful'}, status=status.HTTP_200_OK)
            except Student.DoesNotExist:
                return Response({'error': 'User is not a lecturer'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Invalid credentials or not authorized'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            pass

        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)


class AssignGradeViewSet(viewsets.ViewSet):

    @action(detail=True, methods=['put'])
    def assign_grade(self, request, pk=None):
        try:
            student_enrolment = StudentEnrolment.objects.get(student_id=pk)
        except StudentEnrolment.DoesNotExist:
            return Response({'error': 'Student enrollment not found'}, status=status.HTTP_404_NOT_FOUND)

        student_enrolment.grade = request.data.get('grade', student_enrolment.grade)
        student_enrolment.gradetime = request.data.get('gradetime', student_enrolment.gradetime)

        serializer = StudentEnrolmentSerializer(instance=student_enrolment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
