from django.db import models


class FacilityManager(models.Manager):
    def get_queryset(self):
        """We have complicated ordering requirements (all facilities alphabetically,
           followed by the "non-facility" facility) so this function returns the
           list we want in the order we want, as a normal queryset"""
        # get the normal queryset, then additionally select a true/false column `non-facility`, then order first by
        # this then by the facility name
        return (super(FacilityManager, self)
                .get_queryset()
                .extra(select={'non-facility': 'id=1'})
                .extra(order_by=['non-facility', 'name']))


class Facility(models.Model):
    """Inmate facilities (locations)"""

    name = models.CharField(max_length=250, unique=True)
    restrictsHardbacks = models.BooleanField(verbose_name="This facility restricts hardbacks", default=False)
    otherRestrictions = models.CharField(max_length=250, default="", blank=True, verbose_name="Other Restrictions")

    def __unicode__(self):
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
