from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/albums/', views.AlbumAPIView.as_view()),
    path('api/albums/<int:album_id>', views.AlbumAPIView.as_view()),
    path('api/songs/<int:song_id>', views.SongAPIView.as_view())]
