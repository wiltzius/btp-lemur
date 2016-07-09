#!/usr/bin/env python

"""This script is meant to transport data from the old Books to Prisoners
database into the new Books to Prisoners database. The old system was a 
completely home-rolled implementation that doesn't follow and particular
conventions for database schema, so we require specialized knowledge of it. The
new system is written in Django, so we make use of the Django ORM and the
models defined in the new Books to Prisoners system (see LemurApp/models.py)
to import the data. All the rows in the old database are read and corresponding
new entries are created.


This script takes two arguments: the username and the password for the old
database. They aren't hard-coded for fear they'll end up in the public repository.
The database and host are hard-coded, since this isn't as big a deal and it's
convenient.

It's highly recommended that the user only be allowed to SELECT from the old
table, since this way not much harm can come of it. 
"""

import sys
import copy
import optparse

import server.LemurApp.models.book
import MySQLdb
import server.settings
import datetime
import difflib
from django.core.exceptions import ValidationError
from django.core.management import setup_environ
setup_environ(server.settings)     # This needs to be done before the model import below (we need a Django environment in order to import Django models)
from server.LemurApp import models
from django.db import DatabaseError

## SETTINGS ("do not modify below this line" hahaha jkjk lol)

OLD_DATABASE_HOST = 'cowville.net'
OLD_DATABASE_DB = 'books2pr_bookstoprisoners'

## Global counters

skipped = {'inmates': 0,
           'inmates_duplicate': 0,
           'inmates_noid': 0,
           'orders': 0,
           'orders_empty': 0,
           'books': 0,
           'books_db': 0,
           'books_title': 0,
           'facilities_nomatch_address_used': 0,
           'facilities_nomatch_facility_used': 0,
           'facilities_skipped': 0}   # number of items skipped for validation errors
old_counts = copy.deepcopy(skipped)


## Functions

def add_books(cursor, order, old_order):
    """ Add all the books for the given order found in the database pointed to
        by the given cursor"""
    books = str.split(old_order['books'], "&&")     # a list of all the book IDs
    for book_id in books:
        cursor.execute("SELECT * FROM `books` WHERE `key`=%s" % book_id)
        old_books = cursor.fetchall()
        assert len(old_books) == 1           # just a sanity check to make sure we're dealing with a unique ID
        old_book = old_books[0]
        book = server.LemurApp.models.book.Book()
        book.order = order
        book.title = old_book['title'].decode('latin_1')
        book.author = ', '.join(unicode.split(old_book['authors'].decode('latin_1'), '&&'))
        if not book.title:
            print "Entering book with no title using author (%s) instead" % book.author
            book.title = book.author
            skipped['books_title'] += 1
        book.creation_date = old_book['sys_creation_date']
        if old_book['id_type'] == 'ASN' or old_book['id_type'] == 'ISB':
            book.asin = old_book['id']
        try:
            book.full_clean()
            book.save()
        except ValidationError, e:
            print "Failed to validate book", book, " for reasons: "
            for reason in e.messages:
                print '\t' + reason
            skipped['books'] += 1
        except DatabaseError, e:
            print "Database error!", e
            skipped['books_db'] += 1


def add_orders(cursor, inmate, exact_old_inmate_id):
    """ Add all the orders for the given inmate
        
        The `exact_old_inmate_id` can be used to explicitly look up inmate IDs that didn't follow the canonical
        format (i.e. have spaces or something) but are in the old database nevertheless.
    """
    cursor.execute("SELECT * FROM `orders` WHERE `inmate_num` = '%s'" % exact_old_inmate_id)
    orders = cursor.fetchall()
    for old_order in orders:
        order = models.Order()
        # skip orders with no books
        if old_order['books'] is None:
            skipped['orders_empty'] += 1
            continue
        order.inmate = inmate
        order.status = old_order['status']
        order.date_opened = old_order['date_opened']
        if order.status == 'SENT':
            order.date_closed = old_order['date_opened'] + datetime.timedelta(1)    # we fucked up the old database implementation and all the order close dates are null -- so instead just set the order to be closed 1 day after it was opened
        order.sender = old_order['sender']
        # try validating and saving the order
        try:
            order.full_clean()
            order.save()
        except ValidationError, e:
            print "Order", order, "doesn't pass validation! Reason", e
            skipped['orders'] += 1
            continue    # if the order fails validation continue to the next order for this inmate
        add_books(cursor, order, old_order)


def facility_match(new_inmate, old_inmate):
    """ Performs some witchcraft (actually just uses difflib) to match the free-form
        facilities of the old database to one of the 30-odd canonical facilities of
        the new database. Tries its best to do the match, if it fails uses the
        address field in the new inmate model to mark that this inmate's facility
        could not be matched (so it can be manually fixed later).
        
        new_inmate -- the new Django inmate model
        old_inmate -- dictionary of the old inmate DB record
        """
    
    # make a dictionary of all the canonical facility names (map name to facility object)
    facilities = models.Facility.objects.all().exclude(pk=models.Facility.get_non_facility().pk)
    facility_dict = dict([(facility.name, facility) for facility in facilities])
    
    # strip out extra crap that we don't want in the facility name comparison
    stripped_fac = old_inmate['facility']
    deletions = ['Correctional Center', 'Correctional Facility', 'Correctional Institute', 'Correctional Institution', ]
    for bad in deletions:
        stripped_fac = str.replace(stripped_fac, bad, '')
    # get rid of whitespace
    stripped_fac = str.strip(stripped_fac)
    
    # now try to match the old inmate's facility to one of these names
    matches = difflib.get_close_matches(stripped_fac, facility_dict.keys())
    
    if not matches:
        # couldn't find a good facility! bummer.
        print "Couldn't match facility %s to anything for inmate %s" % (stripped_fac, new_inmate)
        # set the new facility to "other"
        new_inmate.facility = models.Facility.get_non_facility()
        # If we can, use whatever non-canonical facility was in the old record as the address
        if str.strip(old_inmate['facility']):
            print '\t', "...using old facility %s instead" % str.strip(old_inmate['facility']) 
            skipped['facilities_nomatch_facility_used'] += 1
            new_inmate.address = str.strip(old_inmate['facility'])
            return
        # otherwise, use the old address as the new address
        elif str.strip(old_inmate['address']):
            print '\t', "..using old address %s instead" % str.strip(old_inmate['address'])
            skipped['facilities_nomatch_address_used'] += 1
            new_inmate.address = str.strip(old_inmate['address'])
            return
        # if we have neither an old address nor an old facility, fill in a blank address
        else:
            print '\t', "...filling in blank address instead"
            new_inmate.address = "None, fix me!"
            skipped['facilities_skipped'] += 1
            return
    else:
        # take the best one, i.e. the first in the returned matches list
        new_inmate.facility = facility_dict[matches[0]]
        return
    

def add_inmates(cursor):
    """Add all the old inmates to the new database"""
    
    print "Adding inmates..."
    
    cursor.execute("SELECT COUNT(*) as count FROM `inmates`")
    total_inmates = cursor.fetchone()['count']

    cursor.execute("SELECT * FROM `inmates` ORDER BY `lastName`")
    inmates = cursor.fetchall()
    
    inmate_count = 0
    for old_inmate in inmates:
        # track our progress because we're bored
        if inmate_count % 500 == 0:
            print (inmate_count/total_inmates)*100, "% of the way done!"
        inmate_count += 1
    
        # save basic data from the old inmate record into the new one
        inmate = models.Inmate()
        inmate.first_name = old_inmate['firstName']
        inmate.last_name = old_inmate['lastName']
        inmate.creation_date = old_inmate['sys_creation_date']
        
        # check if the creation date was explicitly set to NULL just now, and if so default to the current time
        if inmate.creation_date is None:
            inmate.creation_date = datetime.datetime.now()
        
        # Either copy the old inmate ID or, if it's non-standard, assign a special one
        inmate.inmate_id = old_inmate['inmate_id']
        try:
            # try validating just the inmate ID field (done through exclusion of all other fields, which is kinda dumb)
            inmate.clean_fields(exclude=['first_name', 'last_name', 'address', 'creation_date', 'facility'])
        except ValidationError, e:
            # assign non-ID, to be fixed later
            inmate.inmate_id = models.InmateIDField.NO_ID
            skipped['inmates_noid'] += 1
            print "Inmate %s %s being entered with no ID" % (inmate.first_name, inmate.last_name)

        # Deal with the inmate's facility/address
        facility_match(inmate, old_inmate)
        
        # Check if this inmate has a unique ID. If they don't, then we can assume that there's a duplicate in the old database and point this inmate (and importantly, it's orders) to other entry
        try:
            # try validating just the inmate ID field for uniqueness (done through exclusion of all other fields, which is kinda dumb)
            inmate.validate_unique(exclude=['first_name', 'last_name', 'address', 'creation_date', 'facility'])
        except ValidationError, e:
            # non-unique, point all this inmate's orders to the pre-existing entry
            print "Inmate ID %s is already in the system, assuming duplicate and merging records" % inmate.inmate_id
            other_inmate = models.Inmate.objects.get(inmate_id__exact=inmate.inmate_id)
            inmate = other_inmate
            skipped['inmates_duplicate'] += 1
        
        # validate then save the Inmate model
        try: 
            inmate.full_clean()
            inmate.save()
        except ValidationError, e:
            print "Inmate", inmate, "doesn't pass validation. Reasons:"
            for reason in e.messages:
                print '\t', reason
            skipped['inmates'] += 1
            # this inmate model is no good so go on to the next inmate
            continue
        
        # now add all orders for this inmate
        add_orders(cursor, inmate, old_inmate['inmate_id'])
    

def import_old_data(settings):
    """Connect to the old MySQL server and grab every inmate, then every order
    associated with that inmate, then every book in that order. This should
    cover all our bases and ensure we don't get any dangling references.
    Save everything to the new database."""
    
    # prepare the MySQL connection
    db = MySQLdb.connect(host=OLD_DATABASE_HOST, user=server.settings.user, passwd=server.settings.password, db=OLD_DATABASE_DB)
    c = db.cursor(MySQLdb.cursors.DictCursor)
    
    # If we're doing a real import (not just counting stats)
    if not server.settings.counts_only:
        # Kill the old database 
        print "Deleting old books...",
        server.LemurApp.models.book.Book.objects.all().delete()
        print "done."
        print "Deleting old orders...",
        models.Order.objects.all().delete()
        print "done."
        print "Deleting old inmates...",
        models.Inmate.objects.all().delete()
        print "done."
        # Start the import
        add_inmates(c)
        # print some results
        print "...done adding inmates."
        for key, val in skipped.items():
            print key, ":", val

    # Grab stats from the old database
    print "Old database comparison:"
    c.execute("SELECT COUNT(*) as count FROM inmates")
    old_counts['inmates'] = c.fetchone()['count']
    c.execute("SELECT COUNT(*) as count FROM books")
    old_counts['books'] = c.fetchone()['count']
    c.execute("SELECT COUNT(*) as count FROM orders")
    old_counts['orders'] = c.fetchone()['count']
    c.execute("SELECT COUNT( * ) AS count FROM  `orders` WHERE  `books` IS NULL")
    old_counts['orders_empty'] = c.fetchone()['count']
    
    print "Inmates:", old_counts['inmates'], "old", models.Inmate.objects.count(), "new"
    print "Orders:", old_counts['orders'], "old", \
                     models.Order.objects.count(), "new but", \
                     old_counts['orders_empty'], "had no books so really", old_counts['orders']-old_counts['orders_empty'], "old"
    print "Books:", old_counts['books'], "old", server.LemurApp.models.book.Book.objects.count(), "new"
    
    return 0
    
    

## {{{ http://code.activestate.com/recipes/577058/ (r2)
def query_yes_no(question, default="yes"):
    """Ask a yes/no question via raw_input() and return their answer.
    
    "question" is a string that is presented to the user.
    "default" is the presumed answer if the user just hits <Enter>.
        It must be "yes" (the default), "no" or None (meaning
        an answer is required of the user).

    The "answer" return value is one of "yes" or "no".
    """
    valid = {"yes":"yes",   "y":"yes",  "ye":"yes",
             "no":"no",     "n":"no"}
    if default == None:
        prompt = " [y/n] "
    elif default == "yes":
        prompt = " [Y/n] "
    elif default == "no":
        prompt = " [y/N] "
    else:
        raise ValueError("invalid default answer: '%s'" % default)

    while 1:
        sys.stdout.write(question + prompt)
        choice = raw_input().lower()
        if default is not None and choice == '':
            return default
        elif choice in valid.keys():
            return valid[choice]
        else:
            sys.stdout.write("Please respond with 'yes' or 'no' "\
                             "(or 'y' or 'n').\n")
## end of http://code.activestate.com/recipes/577058/ }}}

def process_command_line(argv):
    """
    Return a 2-tuple: (settings object, args list).
    `argv` is a list of arguments, or `None` for ``sys.argv[1:]``.
    """
    if argv is None:
        argv = sys.argv[1:]

    # initialize the parser object:
    parser = optparse.OptionParser()

    # define options here:
    parser.add_option('-u', '--username', type='string', dest='user', help='Username for old database.')
    parser.add_option('-p', '--password', type='string', dest='password', help='Password for old database.')
    parser.add_option('-c', '--counts', action='store_true', dest='counts_only', help='Only do statistical comparison, not actual database add.')

    (options, args) = parser.parse_args(argv)
    
    if not options.user or not options.password:
        parser.error("Username and password both required. See --help.")

    return (options, args)


## Main

def main(argv=None):
    """Parse the username and password arguments, confirm that this is really
    what we want to do, then go for it."""
    (options, args) = process_command_line(argv)
    
    if query_yes_no(question="Are you sure you want to run the import script (this \
                        may add many entries to the new database and will definitely delete \
                        everything currently in there!", default="no") is "yes":
        return import_old_data(options)
    else:
        return 1        # abort
    

if __name__ == '__main__':
    status = main()
    sys.exit(status)
