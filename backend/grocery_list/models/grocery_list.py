from django.db import models
from django.conf import settings
from ingredient.models import Ingredient

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


class GroceryListItem(models.Model):
    grocery_list = models.ForeignKey(
        GroceryList,
        on_delete=models.CASCADE,
        related_name='items'
    )
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
        related_name='grocery_list_items'
    )
    quantity = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=1
    )
    unit = models.CharField(max_length=50, blank=True, null=True)
    purchased = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} {self.unit or ''} {self.ingredient.name}"
