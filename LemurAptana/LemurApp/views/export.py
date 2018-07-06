from django.shortcuts import render_to_response


def data_export(request):
  return render_to_response('LemurApp/data_export.html')
