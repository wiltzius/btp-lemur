from django.db import models

from .facility_manager import FacilityManager


class Facility(models.Model):
  """Inmate facilities (locations)"""

  name = models.CharField(max_length=250, unique=True)
  restrictsHardbacks = models.BooleanField(verbose_name="This facility restricts hardbacks", default=False)
  otherRestrictions = models.CharField(max_length=250, default="", blank=True, verbose_name="Other Restrictions")
  address = models.CharField(max_length=250, default="", blank=True)

  def __str__(self):
    return self.name

  class Meta:
    verbose_name_plural = "Facilities"
    ordering = ['name']

  # Use the Facility manager to provide custom ordering
  objects = FacilityManager()

  @staticmethod
  def get_non_facility():
    """We have a special facility record that means "facility not in list of normal facilities, enter an address
    manually This special record has a pk of 1; there should be a fixture that has the pk of 1 with this info in
    it.
    """
    return Facility.objects.get(pk=1)
