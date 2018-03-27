from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/albums/', views.AlbumList.as_view(), name='files'),
    path('api/albums/<slug:path>', views.AlbumList.as_view(), name='files'),
    path('api/songs/', views.SongList.as_view(), name='files'),
    path('api/songs/<slug:path>', views.SongList.as_view(), name='files'),
]
