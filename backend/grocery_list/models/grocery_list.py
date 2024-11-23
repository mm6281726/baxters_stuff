from django.db import models

class GroceryList(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(null=True)
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title
