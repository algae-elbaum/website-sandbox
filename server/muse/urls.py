from django.urls import path

from . import views

urlpatterns = [
    path('', views.PlayerView.as_view()),
    path('api/albums/', views.AlbumAPIView.as_view()),
    path('api/albums/<int:album_id>', views.AlbumAPIView.as_view()),
    path('api/songs/<int:song_id>', views.SongAPIView.as_view())]
