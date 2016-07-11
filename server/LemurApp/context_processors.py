from __future__ import print_function
from __future__ import print_function
from models.facility import Facility
from models.settings_store import BannerMessage


# Extra context for the LemurApp

def restricted_facilities(request):
    """Returns a string list of the facilities that restrict hardbacks"""
    try:
        facilities = Facility.objects.filter(restrictsHardbacks__exact=True)
    except Exception as e:
        print("Exception trying to get restricted facilities list:", e.message)
        facilities = ()
    return {'restricted_facilities': facilities}


def banner_message(request):
    """Returns the banner message stored in the database"""
    try:
        message = BannerMessage.get_message()
    except Exception as e:
        print("Exception trying to get banner message:", e.message)
        message = ''
    return {'banner_message': message}