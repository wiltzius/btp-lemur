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
