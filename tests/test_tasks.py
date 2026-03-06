"""
Tests for Celery tasks — notification sending with mocked external services.
"""

import pytest
from unittest.mock import patch, MagicMock
from app.models import MalpraticeDetection, ReviewSession, TeacherProfile
from datetime import date, time


@pytest.mark.django_db
class TestSendMalpracticeNotification:
    """Test the send_malpractice_notification Celery task."""

    @patch('app.tasks.send_mail')
    def test_sends_email(self, mock_mail,
                         malpractice_log, lecture_hall_with_teacher):
        from app.tasks import send_malpractice_notification

        # Mark as malpractice so notification makes sense
        malpractice_log.is_malpractice = True
        malpractice_log.verified = True
        malpractice_log.save()

        result = send_malpractice_notification(malpractice_log.id)

        assert mock_mail.called

    @patch('app.tasks.send_mail')
    def test_handles_missing_log(self, mock_mail):
        from app.tasks import send_malpractice_notification

        # Should not raise, just log error
        send_malpractice_notification(99999)
        assert not mock_mail.called


@pytest.mark.django_db
class TestSendReviewSessionEmail:
    """Test the send_review_session_email Celery task."""

    @patch('app.tasks.send_mail')
    def test_sends_review_email(self, mock_mail,
                                 admin_user, teacher_user,
                                 lecture_hall_with_teacher):
        from app.tasks import send_review_session_email

        session = ReviewSession.objects.create(
            admin_user=admin_user,
            lecture_hall=lecture_hall_with_teacher,
            teacher=teacher_user,
            logs_reviewed=10,
            logs_flagged=3,
            email_sent=False
        )

        send_review_session_email(session.id)

        assert mock_mail.called
        session.refresh_from_db()
        assert session.email_sent is True

    @patch('app.tasks.send_mail')
    def test_handles_missing_session(self, mock_mail):
        from app.tasks import send_review_session_email
        send_review_session_email(99999)
        assert not mock_mail.called
