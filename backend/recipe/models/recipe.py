from django.db import models
from django.conf import settings

class Recipe(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(null=True, blank=True)
    prep_time = models.IntegerField(help_text="Preparation time in minutes", null=True, blank=True)
    cook_time = models.IntegerField(help_text="Cooking time in minutes", null=True, blank=True)
    servings = models.IntegerField(null=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recipes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
