from django.contrib import admin

# Thomas Chemmanoor
# File contains admin info
from whalescaleApp.models import Account

# this line allows the accounts datatable to be seen in the admin pane
admin.site.register(Account)
