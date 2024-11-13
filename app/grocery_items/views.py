from django.http import HttpResponse

from .models import GroceryItem


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def detail(request, grocery_item_id):
    items = GroceryItem.objects.order_by("id")
    output = ", ".join(i.name for i in items)
    return HttpResponse(output)