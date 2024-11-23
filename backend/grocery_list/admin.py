from django.contrib import admin

from .models import GroceryList

class GroceryListAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')

admin.site.register(GroceryList, GroceryListAdmin)
