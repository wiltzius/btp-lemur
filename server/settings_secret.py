DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',                # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'books2pr_dev',            # Or path to database file if using sqlite3.
    }
}

FORCE_SCRIPT_NAME = ''

# secrets

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'AJIXW6PWWTI13BCN1J39LLIOEDXUTPW7PR6LSOXLY4M9GJ29E2'

## Extra settings for the Lemur project
AWS_KEY = 'AKIAIJUA4DCQHDEIVGRA'
AWS_SECRET_KEY = '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'

AWS_ASSOCIATE_TAG = '4agoodcause'

