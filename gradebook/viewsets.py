from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Course, Semester, Lecturer, Student, Class, StudentEnrolment
from .serializers import CourseSerializer, SemesterSerializer, LecturerSerializer, StudentSerializer, ClassSerializer, \
    StudentEnrolmentSerializer, FileUploadSerializer
import pandas


class FileUploadViewSet(viewsets.ViewSet):

    def create(self, request):
        serializer = FileUploadSerializer(data=request.data)

        if serializer.is_valid():
            try:
                # Save students from uploaded Excel file
                students = serializer.save()

                # Optionally return response confirming successful upload
                return Response({'message': 'Students uploaded successfully'}, status=status.HTTP_200_OK)

            except Exception as e:
                # Handle specific exceptions as needed
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
    search_fields = ['user__id']  # Assuming user is a ForeignKey in Student model
    permission_classes = []

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


class StudentEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = StudentEnrolment.objects.all()
    serializer_class = StudentEnrolmentSerializer
