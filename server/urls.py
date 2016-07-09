from django.conf.urls import *
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static

# enable the Django admin interface:
from django.contrib import admin

urlpatterns = patterns('',
    # Enable the Lemur app
    (r'^$', RedirectView.as_view(url='/lemur/inmate/search')),
    (r'^lemur/', include('server.LemurApp.urls')),
    # Uncomment the admin/doc line below to enable admin documentation:
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls))
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
