from storages.backends.s3boto3 import S3Boto3Storage

class MediaStore(S3Boto3Storage):
    # Write media to s3 folder called media
    location = 'media'
    file_overwrite = False
