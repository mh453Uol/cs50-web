## Run in dev enviroment
For the first time you have to do the following

1. `python manage.py migrate`
   
After you have created the sqldb you can run the app as follows

1. `python manage.py runserver`

## Run in preprod enviroment

In preprod enviroment we use AWS S3 bucket to store media files

1. `python manage.py collectstatic --noinput && MODE=PREPROD python manage.py runserver`

## Deploying the django app

Current this app is deployed to Heroku and is part of a mono repo `cs50-web`
Heroku triggers a build then new content is merged to the `listings-app-prod` branch

### Deploy
1. Check in all changes to master
2. Navigate in the terminal to the root `cs50-web`
3. In the terminal enter - git push origin `git subtree split --prefix projects/project2/commerce master`:listings-app-prod --force
   1. We push a subtree to the branch listings-app-prod. The subtree is `projects/project2/commerce`
   2. We have to do this since Heroku will not be able to build our project since if we just push the cs50-web to heroku it see multiple projects


