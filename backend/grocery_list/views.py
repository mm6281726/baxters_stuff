from django.shortcuts import render
from rest_framework import viewsets
from .serializers import GroceryListSerializer
from .models import GroceryList

class GroceryListView(viewsets.ModelViewSet):
    serializer_class = GroceryListSerializer
    queryset = GroceryList.objects.all()