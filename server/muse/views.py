from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return HttpResponse("3, 2, 1 let's jam.")

