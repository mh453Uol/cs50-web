import os
import dj_database_url
import environ

from django.contrib.messages import constants as message_constants

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env = environ.Env(
    DEBUG=(bool, True),
    SECRET_KEY=(str, '6ps8j!crjgrxt34cqbqn7x&b3y%(fny8k8nh21+qa)%ws3fh!q'),
    DATABASE_URL=(str, f'sqlite:///{os.path.join(BASE_DIR, "db.sqlite3")}'),
    AWS_ACCESS_KEY_ID=(str, ''),
    AWS_SECRET_ACCESS_KEY=(str, ''),
    AWS_STORAGE_BUCKET_NAME=(str, ''),
    AWS_S3_CUSTOM_DOMAIN=(str, ''),
    AWS_S3_OBJECT_PARAMETERS=(dict, {'CacheControl': 'max-age=86400'}),
    AWS_DEFAULT_ACL=(str, ''),
    DEFAULT_FILE_STORAGE = (str, 'django.core.files.storage.FileSystemStorage')
)

# reading .env file
if os.getenv('MODE') == 'PREPROD':
    environ.Env.read_env()
    print('************ Running in MODE:PREPROD ************')
    print('Make sure you have ran `python manage.py collectstatic --noinput && MODE=PREPROD python manage.py runserver`')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = ['student-listings.herokuapp.com', 'localhost', '127.0.0.1']

MESSAGE_TAGS = {
    message_constants.ERROR: 'danger'
}

# Application definition

INSTALLED_APPS = [
    'auctions',
    'listings',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize'
]

MIDDLEWARE = [
    # Simplified static file serving.
    # https://warehouse.python.org/project/whitenoise/
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'commerce.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [(os.path.join(BASE_DIR, 'shared'))],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'commerce.wsgi.application'

LOGGING = {
    'disable_existing_loggers': False,
    'version': 1,
    'handlers': {
        'console': {
            # logging handler that outputs log messages to terminal
            'class': 'logging.StreamHandler',
            'level': 'DEBUG', # message level to be written to console
        }
    },
    'loggers': {
        '': {
            # this sets root level logger to log debug and higher level
            # logs to console. All other loggers inherit settings from
            # root level logger.
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False, # this tells logger to send logging message
                                # to its parent (will send if set to True)
        },
        'django.db': {
            'level': 'DEBUG'
        }
    }
}

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASE_URL = env('DATABASE_URL')

DATABASES = {
       'default': dj_database_url.config(default=DATABASE_URL, conn_max_age=600)
}

AUTH_USER_MODEL = 'auctions.User'

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

# Extra places for collectstatic to find static files.
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),   
]

# When you execute collectstatic, django copies from to STATIC_ROOT
STATIC_ROOT = os.path.join(BASE_DIR, 'build/static')
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')
AWS_S3_CUSTOM_DOMAIN = env('AWS_S3_CUSTOM_DOMAIN')
AWS_S3_OBJECT_PARAMETERS = env('AWS_S3_OBJECT_PARAMETERS')
AWS_DEFAULT_ACL = env('AWS_DEFAULT_ACL')

DEFAULT_FILE_STORAGE = env('DEFAULT_FILE_STORAGE')
