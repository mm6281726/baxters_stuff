from django.db import models

class IngredientCategory(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(null=True)

    def __str__(self):
        return self.name
