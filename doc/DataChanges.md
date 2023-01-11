Data Changes:

Changing Database Information:

Current application workflow on the backend:
Run backend on local machine. Test as needed and make changes as needed. The database must run on port 5432. This database will be on the user's local machine.

To change the database the app should model it's schema from, create a postgres database yourself locally and change the values for the database in the database section of the whalescale-backend/whalescale-backend/settings.py file.
Additionally one must change the values supplied to the .gitlab-ci.yml file in the root directory if you are still using the gitlab CICD pipeline to deploy to heroku.
Currently this file is pulling values for names such as $DATABASE_NAME stored in our gitlab repo.
If this code's CICD pipeline changes, these values written like $variable will need to be replaced with your correct values.

To gain complete control over the application create a heroku account and an empty app. Add the postgress extension to your app through the heroku GUI. Finally supply your heroku api key and database name into the .gitlab-ci.yml file.
This means that pushing any change to the backend_beta branch (you can change which branch at the bottom of the .gitlab-ci.yml file) will update your heroku app automatically.

Changing the actual schema:

To change the database schema stored on heroku one must first make the changes to your local database. To do this simple change the whalescale-backend/whalescaleApp/models.py file as you see fit. This file is the database schema.
After making a change to this file, run the command python manage.py makemigrations to have the environment realize changes have been made to the database schema.
After doing this, run python manage.py migrate to migrate these changes to your local database. When you commit these changes to our backend branch backend_beta (again this branch and entire pipeline can be changed in the .gitlab-ci.yml file) they will automatically change the heroku database.


Changing the heroku database manually:

You must connect to your heroku database using your accounts' credentials on data.heroku.com.

With the credentials, a user can run the command heroku pg:psql heroku-database-name-here -app heroku-app-name to connect in your terminal.


Changing where photos are being stored:

Currently they are being stored on an s3 bucket called whalescale owned by Thomas Chemmanoor.
To fully transition this project away from the group members, someone will need to register an aws account with their credit card and create an s3 bucket.
This bucket just needs the policy to allow public reads.
Once this is done, change all four aws variables at the top of the whalescale-backend/whalescaleApp/views.py to the correct values for your account and bucket.
