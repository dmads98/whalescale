# Generated by Django 3.1.3 on 2020-11-13 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('whalescaleApp', '0005_auto_20201111_1926'),
    ]

    operations = [
        migrations.AddField(
            model_name='length',
            name='bezierFit',
            field=models.BooleanField(null=True),
        ),
    ]
