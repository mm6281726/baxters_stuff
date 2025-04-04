from django.contrib import admin

from .models import GroceryList, GroceryListItem

class GroceryListItemInline(admin.TabularInline):
    model = GroceryListItem
    extra = 1

class GroceryListAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'completed', 'user', 'created_at', 'updated_at')
    list_filter = ('completed', 'user', 'created_at')
    search_fields = ('title', 'description')
    inlines = [GroceryListItemInline]

class GroceryListItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'grocery_list', 'ingredient', 'quantity', 'unit', 'purchased')
    list_filter = ('purchased', 'grocery_list')
    search_fields = ('ingredient__name', 'notes')

admin.site.register(GroceryList, GroceryListAdmin)
admin.site.register(GroceryListItem, GroceryListItemAdmin)
