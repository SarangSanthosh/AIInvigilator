# urls.py
from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints (used by React frontend)
    path('api/', include('app.api.urls')),
    
    # Camera script management endpoints (still needed for ML functionality)
    path('run_cameras/', views.run_cameras_page, name='run_cameras_page'),
    path('trigger_camera_scripts/', views.trigger_camera_scripts, name='trigger_camera_scripts'),
    path('stop_camera_scripts/', views.stop_camera_scripts, name='stop_camera_scripts'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)