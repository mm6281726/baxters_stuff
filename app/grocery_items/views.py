from django.http.response import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls.base import reverse
from django.views import generic

from .models import GroceryItem


class IndexView(generic.ListView):
    template_name = "grocery_items/index.html"
    context_object_name = "grocery_items"

    def get_queryset(self):
        return GroceryItem.objects.order_by("id")
    
class DetailView(generic.DetailView):
    model = GroceryItem
    template_name = "grocery_items/detail.html"

def update(request, grocery_item_id):
    grocery_item = get_object_or_404(GroceryItem, pk=grocery_item_id)
    name = request.POST["name"]
    grocery_item.name = name
    grocery_item.save()

    # Always return an HttpResponseRedirect after successfully dealing
    # with POST data. This prevents data from being posted twice if a
    # user hits the Back button.
    return HttpResponseRedirect(reverse("grocery_items:detail", args=(grocery_item.id,)))