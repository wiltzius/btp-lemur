from django.contrib import admin

# Register your models here.
from .models import BannerMessage, Book, Inmate, Order, LemurSettingsStore, Facility

admin.site.register(BannerMessage)
admin.site.register(Book)
admin.site.register(Inmate)
admin.site.register(Order)
admin.site.register(LemurSettingsStore)
admin.site.register(Facility)
