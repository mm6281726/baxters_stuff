from django.db import models

from .category import IngredientCategory

class Ingredient(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(null=True)
    categories = models.ManyToManyField(IngredientCategory, related_name="ingredients")

    def __str__(self):
        return self.name
