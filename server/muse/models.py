from django.db import models

class Album(models.Model):
    name = models.CharField(max_length=200)
    cover_art = models.FileField(upload_to='muse')
    tags = models.CharField(max_length=200)
#    genres = models.ManyToManyField(Genre)

class Song(models.Model):
    name = models.CharField(max_length=200)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    music_file = models.FileField(upload_to='muse')
    tags = models.CharField(max_length=200)

