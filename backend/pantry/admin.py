from django.contrib import admin
from .models import PantryItem

class PantryItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'ingredient', 'quantity', 'unit', 'created_at', 'updated_at')
    list_filter = ('user', 'ingredient__categories')
    search_fields = ('ingredient__name', 'notes')

admin.site.register(PantryItem, PantryItemAdmin)
