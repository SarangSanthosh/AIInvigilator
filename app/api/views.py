from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Count

from app.models import TeacherProfile, LectureHall, MalpraticeDetection
from .serializers import (
    UserSerializer, TeacherProfileSerializer,
    LectureHallSerializer, MalpracticeDetectionSerializer, RegisterSerializer
)


# ============================================
# Authentication Views
# ============================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user and return JWT tokens"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login user and return JWT tokens"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login successful'
        })
    
    return Response(
        {'error': 'Invalid credentials'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    """Update current user profile"""
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user (blacklist refresh token)"""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# Dashboard Statistics
# ============================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats_view(request):
    """Get dashboard statistics"""
    total_malpractices = MalpraticeDetection.objects.count()
    unverified_count = MalpraticeDetection.objects.filter(verified=False).count()
    verified_count = MalpraticeDetection.objects.filter(verified=True).count()
    total_halls = LectureHall.objects.count()
    
    recent_malpractices = MalpracticeDetectionSerializer(
        MalpraticeDetection.objects.order_by('-created_at')[:5],
        many=True
    ).data
    
    return Response({
        'total_malpractices': total_malpractices,
        'unverified_count': unverified_count,
        'verified_count': verified_count,
        'total_halls': total_halls,
        'recent_malpractices': recent_malpractices,
    })


# ============================================
# ViewSets for CRUD operations
# ============================================

class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return TeacherProfile.objects.all()
        return TeacherProfile.objects.filter(user=self.request.user)


class LectureHallViewSet(viewsets.ModelViewSet):
    queryset = LectureHall.objects.all()
    serializer_class = LectureHallSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_building(self, request):
        """Get lecture halls filtered by building"""
        building = request.query_params.get('building')
        if building:
            halls = LectureHall.objects.filter(building=building)
            serializer = self.get_serializer(halls, many=True)
            return Response(serializer.data)
        return Response({'error': 'building parameter required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def buildings(self, request):
        """Get list of all unique buildings"""
        buildings = LectureHall.objects.values_list('building', flat=True).distinct()
        building_list = [{'value': b, 'label': dict(LectureHall.BUILDING_CHOICES).get(b, b)} for b in buildings]
        return Response(building_list)


class MalpracticeDetectionViewSet(viewsets.ModelViewSet):
    queryset = MalpraticeDetection.objects.all()
    serializer_class = MalpracticeDetectionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = MalpraticeDetection.objects.all()
        
        # Filter by lecture hall
        lecture_hall = self.request.query_params.get('lecture_hall')
        if lecture_hall:
            queryset = queryset.filter(lecture_hall_id=lecture_hall)
        
        # Filter by building
        building = self.request.query_params.get('building')
        if building:
            queryset = queryset.filter(lecture_hall__building=building)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(
                created_at__range=[start_date, end_date]
            )
        
        # Filter by verified status
        verified = self.request.query_params.get('verified')
        if verified is not None:
            verified_bool = verified.lower() == 'true'
            queryset = queryset.filter(verified=verified_bool)
        
        # Search by activity type
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(malpractice__icontains=search) |
                Q(lecture_hall__hall_name__icontains=search)
            )
        
        return queryset.order_by('-date', '-time')
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Mark a malpractice as verified"""
        malpractice = self.get_object()
        malpractice.verified = True
        malpractice.save()
        return Response({
            'status': 'verified',
            'data': self.get_serializer(malpractice).data
        })
    
    @action(detail=True, methods=['post'])
    def unverify(self, request, pk=None):
        """Mark a malpractice as unverified"""
        malpractice = self.get_object()
        malpractice.verified = False
        malpractice.save()
        return Response({
            'status': 'unverified',
            'data': self.get_serializer(malpractice).data
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get malpractice statistics"""
        total = self.get_queryset().count()
        verified = self.get_queryset().filter(verified=True).count()
        unverified = self.get_queryset().filter(verified=False).count()
        
        # Group by malpractice type
        by_type = self.get_queryset().values('malpractice').annotate(
            count=Count('id')
        ).order_by('-count')
        
        return Response({
            'total': total,
            'verified': verified,
            'unverified': unverified,
            'by_type': list(by_type)
        })
