from LemurAptana.LemurApp.models.Book import Book
from LemurAptana.LemurApp.models.Facility import Facility
from LemurAptana.LemurApp.models.inmate import Inmate
from LemurAptana.LemurApp.models.Order import Order
from LemurAptana.LemurApp.models.SettingsStore import BannerMessage, LemurSettingsStore
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
