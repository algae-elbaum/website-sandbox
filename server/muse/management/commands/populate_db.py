from django.core.management.base import BaseCommand
from django.core.exceptions import ObjectDoesNotExist
from django.core.files import File
from django.conf import settings
from muse.models import Album, Song
from os import walk, path
import muse.utl as utl

default_album_name = "loose songs"

class Command(BaseCommand):
    args = '<music_root_dir>'
    help = 'our help string comes here'

    def add_arguments(self, parser):
        parser.add_argument('music_root', nargs=1, type=str)

    def _populate_album_table(self, music_root):
        default_album = Album(name=default_album_name)
        default_album.save()
        for root, dirs, files in walk(music_root):
            for d in dirs:
                # Don't double add if rerunning command
                if not Album.objects.filter(name=d):
                    print(d)
                    new = Album(name=d)
                    new.save()
            # Only immediate subdirs of music_root are albums, so break
            break

    def _populate_song_table(self, music_root):
        for root, dirs, files in walk(music_root):
            # Only look for songs in music_root and immediate subdirs
            if root != music_root and path.dirname(root) != music_root:
                continue
            print(root)
            for fname in files:
                if not utl.is_music(fname):
                    continue
                if (root == music_root):
                    album_name = default_album_name
                else:
                    album_name = path.basename(root)
                album = Album.objects.get(name=album_name)
                full_path = path.join(root, fname)
                if not Song.objects.filter(name=fname):
                    print(album.name, full_path)
                    with open(full_path, 'rb') as f:
                        new = Song(name=fname, album=album, music_file=File(f))
                        new.save()

    def handle(self, *args, **options):
        self._populate_album_table(options['music_root'][0])
        print('----')
        self._populate_song_table(options['music_root'][0])
