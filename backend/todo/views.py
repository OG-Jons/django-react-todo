from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.authentication import BasicAuthentication
from .serializers import TodoSerializer
from .models import Todo
from .csrfESA import CsrfExemptSessionAuthentication

# Create your views here.

authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)


class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()
