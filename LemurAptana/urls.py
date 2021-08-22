import debug_toolbar
# from django.conf.urls import url, include
from django.urls import include, re_path
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic import RedirectView

urlpatterns = [
#   url(''),
  # Enable the Lemur app
  re_path(r'^$', RedirectView.as_view(url='/lemur/inmate/search', permanent=True)),
#   re_path(r'^lemur/', include('LemurAptana.LemurApp.urls')),
  # Uncomment the admin/doc line below to enable admin documentation:
  re_path(r'^admin/doc/', include('django.contrib.admindocs.urls')),
  # Uncomment the next line to enable the admin:
  re_path(r'^admin/', include(admin.site.urls)),
  re_path(r'^__debug__/', include(debug_toolbar.urls)),
] + staticfiles_urlpatterns()     # of course you shouldn't use django to serve static files in production, but...
