from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .viewsets import SemesterViewSet, CourseViewSet, LecturerViewSet, StudentViewSet, ClassViewSet, \
     FileUploadViewSet, StudentEnrollmentViewSet

router = DefaultRouter()
router.register(r'semesters', SemesterViewSet, basename='semester')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lecturers', LecturerViewSet, basename='lecturer')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'classes', ClassViewSet, basename='class')
router.register(r'enrollments', StudentEnrollmentViewSet, basename='enrollment')
router.register(r'upload-students', FileUploadViewSet, basename='upload-students')

urlpatterns = [
    path('api/', include(router.urls)),
]
