from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    # Auth views
    register_view, login_view, logout_view,
    user_profile_view, update_profile_view,
    dashboard_stats_view,
    
    # ViewSets
    TeacherProfileViewSet, LectureHallViewSet, MalpracticeDetectionViewSet
)

# Create router for ViewSets
router = DefaultRouter()
router.register(r'teachers', TeacherProfileViewSet, basename='teacher')
router.register(r'lecture-halls', LectureHallViewSet, basename='lecture-hall')
router.register(r'malpractices', MalpracticeDetectionViewSet, basename='malpractice')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', register_view, name='api-register'),
    path('auth/login/', login_view, name='api-login'),
    path('auth/logout/', logout_view, name='api-logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/profile/', user_profile_view, name='api-profile'),
    path('auth/profile/update/', update_profile_view, name='api-profile-update'),
    
    # Dashboard
    path('dashboard/stats/', dashboard_stats_view, name='dashboard-stats'),
    
    # CRUD endpoints from router
    path('', include(router.urls)),
]
