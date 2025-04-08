from django.db import models
from django.conf import settings

class GroceryList(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='grocery_lists',
        null=True  # Making it nullable for backward compatibility
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
