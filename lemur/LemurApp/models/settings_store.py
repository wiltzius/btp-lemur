from django.db import models


class LemurSettingsStore(models.Model):
  settingName = models.CharField(max_length=250, unique=True)
  settingValue = models.CharField(max_length=250)

  class Meta:
    verbose_name_plural = "Lemur Settings"
    ordering = ['settingName']

  @classmethod
  def order_age_warning(cls):
    try:
      obj = cls.objects.get(settingName__exact='order_age_policy')
    except cls.DoesNotExist:
      obj = cls(settingName='order_age_policy', settingValue='3')
      obj.save()

    return int(obj.settingValue)

  def __str__(self):
    return self.settingName + ": " + self.settingValue
