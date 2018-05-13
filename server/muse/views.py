from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.conf import settings
from django.views.generic import ListView
from .models import Album, Song

def index(request):
    return HttpResponse('3, 2, 1 let\'s jam.')


class AlbumsView(ListView):
    template_name = 'muse/files.html'

    def get_queryset(self):
        return Album.objects.filter(name__startswith=self.kwargs.get('path', ''))


class SongsView(ListView):
    template_name = 'muse/files.html'

    def get_queryset(self):
        return Song.objects.filter(album__name__startswith=self.kwargs.get('path', ''))
