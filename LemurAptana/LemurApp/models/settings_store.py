from django.db import models


class LemurSettingsStore(models.Model):
  settingName = models.CharField(max_length=250, unique=True)
  settingValue = models.CharField(max_length=250)

  class Meta:
    verbose_name_plural = "Lemur Settings"
    ordering = ['settingName']

  @classmethod
  def order_age_warning(cls):
    return int(cls.objects.get(settingName__exact='order_age_policy').settingValue)

  def __str__(self):
    return self.settingName + ": " + self.settingValue