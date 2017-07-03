from django.contrib import admin

from LemurAptana.LemurApp.models import Facility, Inmate, Order, Book
from LemurAptana.LemurApp.models.banner_message import BannerMessage
from LemurAptana.LemurApp.models.settings_store import LemurSettingsStore

admin.site.register(Facility)

class InmateAdmin(admin.ModelAdmin):
    search_fields = ['inmate_id', 'first_name', 'last_name', 'address']
admin.site.register(Inmate, InmateAdmin)

class OrderAdmin(admin.ModelAdmin):
    search_fields = ['inmate__inmate_id']
admin.site.register(Order, OrderAdmin)

admin.site.register(Book)

admin.site.register(BannerMessage)

admin.site.register(LemurSettingsStore)
