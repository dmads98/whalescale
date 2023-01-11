Rebuilding/Accessing the app server:

Use these Credentials:

Host: ec2-54-160-18-230.compute-1.amazonaws.com
Database: d2q57hss0l1l3t
User: owadaymwalzvgf
Port: 5432
Password: f71738badf7d38fe2ce31fe7c03bec24735a86cc1429ac15caaae3991cb230ed
URI: postgres://owadaymwalzvgf:f71738badf7d38fe2ce31fe7c03bec24735a86cc1429ac15caaae3991cb230ed@ec2-54-160-18-230.compute-1.amazonaws.com:5432/d2q57hss0l1l3t
Access the server using this command in your terminal:
Heroku CLI: heroku pg:psql postgresql-concentric-92587 --app whalescale-stagingcicd



Vercel: once we transition the repo to GitHub, we need to add the GitHub account of the developer/maintainer who will overseek the GitHub repo and I will move the CD pipeline to that repo and give administrative rights. There are no sharing of logins here per se, as all modern high level SaaS for developers now works with access levels.