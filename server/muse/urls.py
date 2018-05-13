from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/albums/', views.AlbumsView.as_view(), name='files'),
    path('api/albums/<slug:path>', views.AlbumsView.as_view(), name='files'),
    path('api/songs/', views.SongsView.as_view(), name='files'),
    path('api/songs/<slug:path>', views.SongsView.as_view(), name='files'),
]

