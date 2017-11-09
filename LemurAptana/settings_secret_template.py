
DATABASES = {
  'default': {
    # engine should be 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': 'sqlite.db',  # DB name or path to database file if using sqlite3.
    # 'USER': '',  # Not used with sqlite3.
    # 'PASSWORD': '',  # Not used with sqlite3.
    # 'HOST': '',  # Set to empty string for localhost. Not used with sqlite3.
    # 'PORT': '',  # Set to empty string for default. Not used with sqlite3.
  }
}

# secrets

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'MAKETHISSOMETHINGREALLYGOOD'

# Extra settings for the Lemur project
GBOOKS_KEY = ''   # must set this

RAVEN_CONFIG = {
  'dsn': '',    # must set this
  # If you are using git, you can also automatically configure the
  # release based on the git info.
  # 'release': raven.fetch_git_sha(os.path.dirname(os.pardir)),
}
