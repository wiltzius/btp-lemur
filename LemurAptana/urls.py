import debug_toolbar
from django.conf.urls import *
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic import RedirectView

urlpatterns = patterns(
  '',
  # Enable the Lemur app
  (r'^$', RedirectView.as_view(url='/lemur/inmate/search', permanent=True)),
  (r'^lemur/', include('LemurAptana.LemurApp.urls')),
  # Uncomment the admin/doc line below to enable admin documentation:
  (r'^admin/doc/', include('django.contrib.admindocs.urls')),
  # Uncomment the next line to enable the admin:
  (r'^admin/', include(admin.site.urls)),
  (r'^__debug__/', include(debug_toolbar.urls)),
) + staticfiles_urlpatterns()     # of course you shouldn't use django to serve static files in production, but...
