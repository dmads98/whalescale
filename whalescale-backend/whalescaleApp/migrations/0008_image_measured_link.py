# Generated by Django 3.1.3 on 2020-11-15 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('whalescaleApp', '0007_auto_20201115_0317'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='measured_link',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
