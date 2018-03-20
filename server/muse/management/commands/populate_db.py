from django.core.management.base import BaseCommand
from muse.models import MusicFile
from django.conf import settings
import os
from os.path import join, getsize

class Command(BaseCommand):
    args = '<foo bar ...>'
    help = 'our help string comes here'

    def _add_music_file(self, name, path):
        if not MusicFile.objects.filter(name=name).exists():
            new_music_file = MusicFile(name=name, path=path)
            new_music_file.save()

    def _populate_music_files_model(self):
        music_files = []
        for root, dirs, files in os.walk(settings.MUSIC_DIR):
            for f in files:
                self._add_music_file(f, join(root, f))
        return music_files

    def handle(self, *args, **options):
        self._populate_music_files_model()
