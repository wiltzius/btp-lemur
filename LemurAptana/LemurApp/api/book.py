from LemurAptana.LemurApp.models.book import Book
from rest_framework import serializers
from rest_framework import viewsets


class BookSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Book
        fields = ('pk', 'status', 'inmate', 'date_opened', 'date_closed', 'sender')


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
