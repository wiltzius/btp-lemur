from LemurAptana.LemurApp.models import Facility, Inmate, Order, Book, BannerMessage
from django.contrib import admin

admin.site.register(Facility)

class InmateAdmin(admin.ModelAdmin):
    search_fields = ['inmate_id', 'first_name', 'last_name', 'address']
admin.site.register(Inmate, InmateAdmin)

class OrderAdmin(admin.ModelAdmin):
    search_fields = ['inmate__inmate_id']
admin.site.register(Order, OrderAdmin)

admin.site.register(Book)

admin.site.register(BannerMessage)
