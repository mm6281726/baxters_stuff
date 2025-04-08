from django.db import models
from ingredient.models import Ingredient
from .grocery_list import GroceryList

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
