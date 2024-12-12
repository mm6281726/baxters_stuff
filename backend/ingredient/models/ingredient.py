from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(null=True)
    category = models.CharField(max_length=120)

    def _str_(self):
        return self.name
