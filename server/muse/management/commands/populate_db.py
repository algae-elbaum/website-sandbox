from django.core.management.base import BaseCommand
from django.core.exceptions import ObjectDoesNotExist
from django.core.files import File
from django.conf import settings
from muse.models import Album, Song
from os import walk, path
from muse.utl import is_music

class Command(BaseCommand):
    args = '<foo bar ...>'
    help = 'our help string comes here'

    music_root = path.join(settings.MEDIA_ROOT, 'music')

    def _populate_album_table(self):
        root = Album(name=path.basename(self.music_root))
        root.save()
        for root, dirs, files in walk(self.music_root):
            for d in dirs:
                print(d)
                if not Album.objects.filter(name=d):
                    new = Album(name=d)
                    new.save()

    def _populate_song_table(self):
        for root, dirs, files in walk(self.music_root):
            for fname in files:
                if is_music(fname):
                    album = Album.objects.get(name=path.basename(root))
                    full_path = path.join(root, fname)
                    print(album.name, full_path)
                    with open(full_path, 'rb') as f:
                        new = Song(name=fname, album=album, music_file=File(f))
                        new.save()

    def handle(self, *args, **options):
        Album.objects.all().delete()
        self._populate_album_table()
        self._populate_song_table()
