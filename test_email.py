#!/usr/bin/env python
"""Test email notification by simulating malpractice verification"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from app.models import MalpraticeDetection, LectureHall
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings

print("\n" + "="*60)
print("EMAIL NOTIFICATION TEST")
print("="*60 + "\n")

# Get or create test data
hall = LectureHall.objects.first()
if not hall:
    print("❌ No lecture hall found. Please create one first.")
    exit(1)

print(f"✓ Lecture Hall: {hall}")
print(f"✓ Assigned Teacher: {hall.assigned_teacher}")
if hall.assigned_teacher:
    print(f"✓ Teacher Email: {hall.assigned_teacher.email}\n")

# Find or create a test log
log = MalpraticeDetection.objects.filter(verified=False).first()
if not log:
    print("No unverified logs found. Creating a test log...")
    log = MalpraticeDetection.objects.create(
        malpractice="Test - Mobile Phone Detection",
        proof="test_video.mp4",
        is_malpractice=None,
        verified=False,
        lecture_hall=hall
    )
else:
    # Update the log with lecture hall
    log.lecture_hall = hall
    log.save()

print(f"✓ Using log ID: {log.id}")
print(f"✓ Malpractice type: {log.malpractice}")
print(f"✓ Proof: {log.proof}\n")

# Now verify it as malpractice (simulating admin approval)
print("Simulating admin approval (marking as 'Yes')...\n")
log.verified = True
log.is_malpractice = True
log.save()

# Trigger the notification
if log.lecture_hall and log.lecture_hall.assigned_teacher:
    print("Triggering email notification...\n")
    
    # Send email directly (without decorator issues)
    teacher_user = log.lecture_hall.assigned_teacher
    
    subject = 'Malpractice Alert: New Case Reviewed'
    message_body = (
        f"Dear {teacher_user.get_full_name() or teacher_user.username},\n\n"
        f"A malpractice has been detected in your classroom and has been approved by the examination cell.\n\n"
        f"Details:\n"
        f"- 📅 Date: {log.date}\n"
        f"- ⏰ Time: {log.time}\n"
        f"- 🎯 Type: {log.malpractice}\n"
        f"- 🏫 Lecture Hall: {log.lecture_hall.building} - {log.lecture_hall.hall_name}\n\n"
        f"You can view the recorded video proof from your AIInvigilator portal.\n\n"
        f"Best regards,\nAIInvigilator Team"
    )
    
    print(f"From: {settings.EMAIL_HOST_USER}")
    print(f"To: {teacher_user.email}")
    print(f"Subject: {subject}\n")
    
    try:
        send_mail(subject, message_body, settings.EMAIL_HOST_USER, [teacher_user.email], fail_silently=False)
        print("\n" + "="*60)
        print("✅ EMAIL SENT SUCCESSFULLY!")
        print("="*60)
        print(f"\n📧 Check your inbox: {teacher_user.email}")
        print("📧 Also check spam/junk folder!")
    except Exception as e:
        print("\n" + "="*60)
        print("❌ EMAIL FAILED!")
        print("="*60)
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
else:
    print("❌ Cannot send email: No teacher assigned to lecture hall")
