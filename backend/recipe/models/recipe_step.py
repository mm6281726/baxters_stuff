from django.db import models
from .recipe import Recipe

class RecipeStep(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='steps'
    )
    step_number = models.PositiveIntegerField()
    description = models.TextField()

    class Meta:
        ordering = ['step_number']
        unique_together = ['recipe', 'step_number']

    def __str__(self):
        return f"Step {self.step_number}: {self.description[:50]}..."
