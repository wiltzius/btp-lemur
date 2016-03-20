from django.core.serializers import serialize
from django.db.models.query import QuerySet
import json
from django import template
from LemurAptana.LemurApp.models import Inmate
from django.utils.html import escapejs
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def jsonify(object):
    """template tag to return a JSON representation of a given object"""
    if isinstance(object, QuerySet):
        return mark_safe(escapejs(serialize('json', object)))
    return mark_safe(escapejs(json.dumps(object)))


@register.simple_tag
def inmate_doc_link(inmate_pk, link_text):
    """template tag to make DOC links for inmates"""
    inmate = Inmate.objects.get(pk=inmate_pk)   # TODO catch a not-found exception and return blank
    if inmate.inmate_type() is None:
        return 'No inmate ID'
    elif inmate.inmate_type() == Inmate.InmateType.FEDERAL:
        # return '<a target="blank" href="http://www.bop.gov/iloc2/InmateFinderServlet?Transaction=IDSearch&IDType=IRN&IDNumber=%s">%s</a>' % (inmate.inmate_id_formatted(), link_text)
        return 'Federal inmates do not have DOC links'
    elif inmate.inmate_type() == Inmate.InmateType.ILLINOIS:
        return '''
                <form action="http://www.idoc.state.il.us/subsections/search/ISinms2.asp" style="display:none;" method="post" onsubmit="return validate()" target="blank" id="inmateform%(inmate_pk)s">
                    <select name="selectlist1" size="4" onchange="setfocus()">
                        <option value="IDOC" selected="selected">&nbsp;</option>
                    </select>
                    <input type="text" size="16" name="idoc" value="%(inmate_id)s" maxlength="25" />
                </form>
                <a href="javascript:$('#inmateform%(inmate_pk)s').submit()">%(link_text)s</a>
                ''' % { 'inmate_id': inmate.inmate_id_formatted(), 'link_text': link_text, 'inmate_pk': inmate.pk }
    elif inmate.inmate_type() == Inmate.InmateType.ARIZONA:
        return '<a target="blank" href="http://www.azcorrections.gov/inmate_datasearch/results_Minh.aspx?InmateNumber=%s">%s</a>' % (inmate.inmate_id_formatted(), link_text) 


## Below taken from http://djangosnippets.org/snippets/194/

@register.filter
def truncchar(value, arg):
    """truncate after a certain number of characters"""
    if len(value) < arg:
        return value
    else:
        return value[:arg] + '...'


## Below taken from http://djangosnippets.org/snippets/1627/

"""
Decorator to facilitate template tag creation
"""
def easy_tag(func):
    """deal with the repetitive parts of parsing template tags"""
    def inner(parser, token):
        #print token
        try:
            return func(*token.split_contents())
        except TypeError:
            raise template.TemplateSyntaxError('Bad arguments for tag "%s"' % token.split_contents()[0])
    inner.__name__ = func.__name__
    inner.__doc__ = inner.__doc__
    return inner



class AppendGetNode(template.Node):
    def __init__(self, dict):
        self.dict_pairs = {}
        for pair in dict.split(','):
            pair = pair.split('=')
            self.dict_pairs[pair[0]] = template.Variable(pair[1])
            
    def render(self, context):
        get = context['request'].GET.copy()

        for key in self.dict_pairs:
            get[key] = self.dict_pairs[key].resolve(context)
        
        path = context['request'].META['PATH_INFO']
        
        #print "&".join(["%s=%s" % (key, value) for (key, value) in get.items() if value])
        
        if len(get):
            path += "?%s" % "&".join(["%s=%s" % (key, value) for (key, value) in get.items() if value])
        
        
        return path

@register.tag()
@easy_tag
def append_to_get(_tag_name, dict):
    return AppendGetNode(dict)
