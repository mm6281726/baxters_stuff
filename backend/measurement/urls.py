from django.urls import path
from .apis.unit_conversion import convert_units_api, get_common_units

urlpatterns = [
    path('convert/', convert_units_api, name='convert_units'),
    path('common-units/', get_common_units, name='common_units'),
]
