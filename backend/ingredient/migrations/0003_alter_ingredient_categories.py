# Generated by Django 4.2.16 on 2024-12-17 21:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ingredient', '0002_remove_ingredient_category_ingredient_categories'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='categories',
            field=models.ManyToManyField(related_name='ingredients', to='ingredient.ingredientcategory'),
        ),
    ]
