from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

from . import views
from rest_framework.routers import DefaultRouter
from .viewsets import SemesterViewSet, CourseViewSet, LecturerViewSet, StudentViewSet, ClassViewSet, \
    FileUploadViewSet, StudentEnrollmentViewSet, AdminLoginViewSet, LogoutViewSet, LecturerLoginViewSet, \
    StudentLoginViewSet, AssignGradeViewSet

router = DefaultRouter()
router.register(r'semesters', SemesterViewSet, basename='semester')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lecturers', LecturerViewSet, basename='lecturer')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'classes', ClassViewSet, basename='class')
router.register(r'enrollments', StudentEnrollmentViewSet, basename='enrollment')
router.register(r'upload-students', FileUploadViewSet, basename='upload-students')
router.register(r'admin-login', AdminLoginViewSet, basename='admin-login')
router.register(r'logout', LogoutViewSet, basename='logout')
router.register(r'lecturer-login', LecturerLoginViewSet, basename='lecturer-login')
router.register(r'student-login', StudentLoginViewSet, basename='student-login')
router.register(r'assign-grade', AssignGradeViewSet, basename='assign-grade')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),
]
