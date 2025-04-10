from django.contrib import admin
from .models import Recipe, RecipeItem, RecipeStep

class RecipeItemInline(admin.TabularInline):
    model = RecipeItem
    extra = 1

class RecipeStepInline(admin.TabularInline):
    model = RecipeStep
    extra = 1
    ordering = ['step_number']

class RecipeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'prep_time', 'cook_time', 'servings', 'user', 'created_at', 'updated_at')
    list_filter = ('user', 'created_at')
    search_fields = ('title', 'description')
    inlines = [RecipeItemInline, RecipeStepInline]

class RecipeItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipe', 'ingredient', 'quantity', 'unit')
    list_filter = ('recipe', 'ingredient__categories')
    search_fields = ('ingredient__name', 'notes')

class RecipeStepAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipe', 'step_number', 'description')
    list_filter = ('recipe',)
    search_fields = ('description',)
    ordering = ['recipe', 'step_number']

admin.site.register(Recipe, RecipeAdmin)
admin.site.register(RecipeItem, RecipeItemAdmin)
admin.site.register(RecipeStep, RecipeStepAdmin)
