from django.core.management.base import BaseCommand
from muse.models import Album


class Command(BaseCommand):

    def handle(self, *args, **options):
        Album.objects.all().delete()
