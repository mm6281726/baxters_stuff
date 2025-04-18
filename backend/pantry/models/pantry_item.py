from django.db import models
from django.conf import settings
from ingredient.models import Ingredient

class PantryItem(models.Model):
    # Stock level choices
    STOCK_LEVELS = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
        ('out', 'Out of Stock')
    ]

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
    # Keep quantity and unit for compatibility, but make them optional
    quantity = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )
    unit = models.CharField(max_length=50, blank=True, null=True)

    # Add stock level field
    stock_level = models.CharField(
        max_length=10,
        choices=STOCK_LEVELS,
        default='medium'
    )

    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['ingredient__name']

    def __str__(self):
        if self.quantity is not None:
            return f"{self.quantity} {self.unit or ''} {self.ingredient.name} ({self.get_stock_level_display()})"
        return f"{self.ingredient.name} ({self.get_stock_level_display()})"
