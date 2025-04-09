from django.db import models
from ingredient.models import Ingredient
from .recipe import Recipe

class RecipeItem(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='items'
    )
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
        related_name='recipe_items'
    )
    quantity = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=1
    )
    unit = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['ingredient__name']

    def __str__(self):
        return f"{self.quantity} {self.unit or ''} {self.ingredient.name}"
