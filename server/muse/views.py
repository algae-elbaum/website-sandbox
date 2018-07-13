from django.views.generic import View
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from .models import Album, Song
import json

def index(request):
    return HttpResponse('3, 2, 1 let\'s jam.')


class AlbumAPIView(View):
    def get(self, request, *args, **kwargs):
        album_id = kwargs.get('album_id')
        if album_id:
            album = get_object_or_404(Album, id=album_id)
            album_data = {"name": album.name,
                          "id": album.id,
                          "cover_art": album.cover_art.url if album.cover_art else None,
                          "songs": []}
            for song in album.song_set.all():
                album_data["songs"].append({"name": song.name,
                                            "id": song.id})
            return JsonResponse(album_data)
        else:
            # List all albums
            albums_data = []
            for a in Album.objects.all():
                albums_data.append({"name": a.name,
                                    "id": a.id,
                                    "cover_art": a.cover_art.url if a.cover_art else None})
            return JsonResponse(albums_data, safe=False)
 

class SongAPIView(View):
    def get(self, request, *args, **kwargs):
        song = get_object_or_404(Song, id=kwargs.get('song_id'))
        song_data = {"name": song.name,
                     "id": song.id,
                     "album_id": song.album_id,
                     "file_url": song.music_file.url}
        return JsonResponse(song_data, safe=False)

