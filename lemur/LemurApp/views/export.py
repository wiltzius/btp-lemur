from django.shortcuts import render


def data_export(request):
  return render(request, 'LemurApp/data_export.html')
