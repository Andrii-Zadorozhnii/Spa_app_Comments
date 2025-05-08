from .views import AttachmentUploadView, CaptchaView, CommentListCreateView, CommentListView, CsrfTokenView
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path


urlpatterns = [
    path('attachments/', AttachmentUploadView.as_view(), name='attachment-upload'),
    path('captcha/', CaptchaView.as_view(), name='captcha'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf_token'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)