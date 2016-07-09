from server.LemurApp.models.book import Book
from server.LemurApp.models.facility import Facility
from server.LemurApp.models.inmate import Inmate
from server.LemurApp.models.order import Order
from server.LemurApp.models.settings_store import BannerMessage, LemurSettingsStore
from django.contrib import admin

admin.site.register(Facility)

admin.site.register(Book)

admin.site.register(BannerMessage)

admin.site.register(LemurSettingsStore)


class InmateAdmin(admin.ModelAdmin):
    search_fields = ['inmate_id', 'first_name', 'last_name', 'address']


admin.site.register(Inmate, InmateAdmin)


class OrderAdmin(admin.ModelAdmin):
    search_fields = ['inmate__inmate_id']


admin.site.register(Order, OrderAdmin)
