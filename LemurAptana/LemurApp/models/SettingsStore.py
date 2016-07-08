from django.db import models


class BannerMessage(models.Model):
    """Special model for the banner message. There should only ever be 1 record here, but we put it in the
    database to allow it to be easily edited trough the admin interface

    Therefore, access the banner message through the special "handle" field, set to 1 --

    message = BannerMessage.get(handle__exact=1)

    ... or better yet use the shortcut method BannerMessage.get_message() below.

    """
    message = models.CharField(max_length=250, unique=True)
    # this should be set to 1 for the banner message entry row
    handle = models.IntegerField(unique=True, verbose_name="Handle (leave this as 1!)")

    def __unicode__(self):
        return self.message

    @staticmethod
    def get_message():
        return BannerMessage.objects.get(handle__exact=1)


class LemurSettingsStore(models.Model):
    settingName = models.CharField(max_length=250, unique=True)
    settingValue = models.CharField(max_length=250)

    class Meta:
        verbose_name_plural = "Lemur Settings"
        ordering = ['settingName']

    @classmethod
    def order_age_warning(cls):
        return int(cls.objects.get(settingName__exact='order_age_policy').settingValue)

    def __unicode__(self):
        return self.settingName + ": " + self.settingValue