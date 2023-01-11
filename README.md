## WhaleScale

# Project Purpose
WhaleScale exposes the photogrammetry calculations available in MorphometriX through a clean and simple web user. 

Before WhaleScale, researchers needed to install cryptic tools via the Terminal and researchers who were not tech savvy were out of luck. After WhaleScale, researchears of all kinds can use photogrammetry to measure marine life.

# Dependencies

Major: NodeJS 12.0, React 17.0

Minor: A full list of dependencies can be found in the packages.json file. Not included here for the sake of keeping the README easy to read.

# How to Deploy
-> Frontend: Pushing to "master" triggers an automatic CD deploy pipeline powered through Vercel.app. If setup of new pipeline needed to go Vercel.app. Any free static website hosting will work here, such as Github Pages or Netlify.

-> Backend: To deploy the backend one only needs to push their changes to the backend_beta branch. Provided that 'host' is 'postgres' in the database section of the whalescale-backend/whalescale-backend/settings.py file. This will automatically run tests that can be tracked in Gitlab and only once they all succeed will it update the heroku backend.



