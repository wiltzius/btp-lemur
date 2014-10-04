from django.conf.urls import *
from django.views.generic import RedirectView
from django.conf import settings

# enable the Django admin interface:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Enable the Lemur app
    (r'^$', RedirectView.as_view(url='/lemur/inmate/search')),
    (r'^lemur/', include('LemurAptana.LemurApp.urls')),
    # Uncomment the admin/doc line below to enable admin documentation:
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls))
)

# For development, statically serve media using Django instead of the normal web server
if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    )
