from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import MusicFile

def index(request):
    return HttpResponse('3, 2, 1 let\'s jam.')

def files(request):
    music_files = []
    for f in MusicFile.objects.all():
        music_files.append(f)
    return render(request, 'muse/files.html', {'music_files': music_files})

