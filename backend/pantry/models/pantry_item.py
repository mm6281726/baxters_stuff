from django.db import models
from django.conf import settings
from ingredient.models import Ingredient

class PantryItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pantry_items'
    )
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
        related_name='pantry_items'
    )
    quantity = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=1
    )
    unit = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['ingredient__name']

    def __str__(self):
        return f"{self.quantity} {self.unit or ''} {self.ingredient.name}"
