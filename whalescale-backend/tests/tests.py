
from django.test import TestCase

# Create your tests here.

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.utils import json

from whalescaleApp.models import Image, Account
from django.test import Client

# Author Thomas Chemmanoor
# This file holds all the backend tests for the project
#To run the tests locally:
# make sure that in whalescale-backend/whalescale-backend/settings.py host in the database section is set to 'localhost'
#use this commaned: pytest --cov=whaleScaleApp tests/ --verbosity=2


from whalescaleApp.serializers import ImageSerializer, AccountSerializer


class APITests(TestCase):

    def setUp(self):
        image = Image.objects.create(name = "whaleTestImage.jpg")
        account = Account.objects.create(username="testaccount", password="test")
        self.image_id = image.id
        self.account_username = account.username
        self.valid_measurement = {
            "params":{

            "imageId" : image.id,
            "focalLength" : 0.32,
            "pixelDimension": 0.567654,
            "altitude": 0.123,
            "lengths": [{
                "name": "TESTLENGTH",
                "value": 43.67,
                "widths": [13,14,15,10],
                "bezierFit": 1
            }],
            "areas": [{
                "name": "TEST AREA",
                "value": 35.06
            }],
            "angles": [{
                "name": "TEST ANGLE",
                "value": 24.6
            }]
                }
            }
        self.login = {
            'username': account.username,
            'password': account.password,
        }
        self.pins = {
            'x0': 5,
            'y0': 4,
            'x1': 1,
            'y1': 1,
            'vx': 3,
            'vy': 3,
        }
        self.valid_widths = {
            "params": {
            'xs': [5,4,3,2,1],
            'ys': [1,2,3,4,5],
            'm': [19,22,33,9,14],
            'l': [12,14,3,5,13],
            'numSegments': 3,
            'canvasHeight': 800,
            'canvasWidth': 1200,
            }
        }

        self.valid_measurement2 = {
            "params": {
                "objects": [
                    {
                        "name": "TESTLENGTH",
                        "bezier": 0,
                        'path': [{'x1':2,'y1':2},{'x1':1,'y1':1},{'x1':0,'y1':0,'x':-1,'y':-1}],
                        'measurementtype': "length",
                        'widthsegments': -1,
                    },
                    {
                        "name": "TESTANGLE",
                        'measurementtype': "angle",
                        'path': [{'x1':100,'y1':200},{'x1':100,'y1':100,'x':0,'y':0}],
                    },
                    {
                        "name": "TESTAREA",
                        'measurementtype': "area",
                        'path': [{'x1': 100, 'y1': 200}, {'x1': 150, 'y1': 150}, {'x1': 100, 'y1': 200}],
                    },

                ],
                "imageName": "testImage",
                "imageWidth": 1920,
                "imageHeight": 1200,
                "canvasWidth": 1920,
                "canvasHeight": 1200,
                "focalLength": 0.32,
                "pixelDimension": 0.567654,
                "altitude": 0.123,
                "lengths": [{
                    "name": "TESTLENGTH",
                    "value": 43.67,
                    "widths": [13, 14, 15, 10],
                    "bezierFit": 1
                }],
                "areas": [{
                    "name": "TEST AREA",
                    "value": 35.06
                }],
                "angles": [{
                    "name": "TEST ANGLE",
                    "value": 24.6
                }]
            }
        }
        self.valid_path = {
        'path': {'x1': 2, 'y1': 2},
        'path': {'x': 1, 'y': 1},
        'path': {'x': 0, 'y': 0},
        'path': { 'x': -1, 'y': -1},
        }

    def test_indexAPIRoute(self):
        """Home Page Request"""
        c = Client()
        response = c.get(path='')
        self.assertEqual(response.status_code, 200)

    # def test_getExcelAPIRoute(self):
    #     """Excel Sheet Request"""
    #     url = reverse('get-excel/1')
    #     c = Client()
    #     response = c.get(url)
    #     self.assertEqual(response.status_code, 200)

    # def test_exportAPIRoute(self):
    #     """Save Image Request"""
    #     url = reverse('export')
    #     c = Client()
    #     response = c.post(url)
    #     self.assertEqual(response.status_code, 200)

    def test_BadindexAPIRoute(self):
        """(Negative)Home Page Request"""
        c = Client()
        response = c.get('/index/')
        self.assertEqual(response.status_code, 404)

    def test_BadgetExcelAPIRoute(self):
        """(Negative)Excel Sheet Image Request"""
        c = Client()
        response = c.post('get-excel/')
        self.assertEqual(response.status_code, 404)

    def test_BadexportAPIRoute(self):
        """(Negative)Save Image Request"""
        c = Client()
        response = c.post('/export2/')
        self.assertEqual(response.status_code, 404)


    def test_BADgetImageListAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.get('image-list')
        self.assertEqual(response.status_code, 404)

    def test_BADgetImageDetailAPIRoute(self):
        """(Negative)Image Detail Request"""
        c = Client()
        response = c.get('image-detail',args=(1,))
        self.assertEqual(response.status_code, 404)

    def test_BADgetImageUpdateAPIRoute(self):
        """(Negative)Image Detail Request"""
        c = Client()
        response = c.put('image-update',args=(1,))
        self.assertEqual(response.status_code, 404)

    def test_BADimageDeleteAPIRoute(self):
        """(Negative)Image Delete Request"""
        c = Client()
        response = c.delete('image-detail', args=(1,))
        self.assertEqual(response.status_code, 404)

    def test_BADgetAccountDetailAPIRoute(self):
        """(Negative)Account Detail Request"""
        c = Client()
        response = c.get('account-detail',args=(1,))
        self.assertEqual(response.status_code, 404)

    def test_BADaccountUpdateAPIRoute(self):
        """(Negative)Account Detail Request"""
        c = Client()
        response = c.put('account-update',args=(1,))
        self.assertEqual(response.status_code, 404)

    def test_BADaccountDeleteAPIRoute(self):
        """(Negative)Account Delete Request"""
        c = Client()
        response = c.delete('account-detail', args=(1,))
        self.assertEqual(response.status_code, 404)

    def test_getImageListAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.get(reverse('image-list'))
        images = Image.objects.all()
        serializer = ImageSerializer(images, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_getAccountListAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.get(reverse('account-list'))
        accounts = Account.objects.filter(username="testaccount")
        serializer = AccountSerializer(accounts, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_saveMeasurementAPIRoute(self):
    #     """(Negative)Image List Request"""
    #     c = Client()
    #     # response = c.post(reverse('saveMeasurements'))

    #     response = c.post(
    #         reverse('saveMeasurements'),
    #         data=json.dumps(self.valid_measurement),
    #         content_type='application/json'
    #     )
    #     # accounts = Account.objects.all()
    #     # serializer = ImageSerializer(accounts, many=True)
    #     # self.assertEqual(response.data, serializer.data)
    #     self.assertEqual(response.status_code, 200)

    def test_deleteAccountListAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.delete(reverse('account-delete',kwargs={"username": self.account_username}))
        # accounts = Account.objects.filter(username="testaccount")
        # serializer = AccountSerializer(accounts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_getExcelAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.get(
            reverse('get-excelid', kwargs={'pk': str(self.image_id)}))
        # accounts = Account.objects.filter(username="testaccount")
        # serializer = AccountSerializer(accounts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_imageDetailAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.get(
            reverse('image-detail', kwargs={'pk': str(self.image_id)}))
        # accounts = Account.objects.filter(username="testaccount")
        # serializer = AccountSerializer(accounts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_accountDetailAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.get(
            reverse('account-detail', kwargs={'username': str(self.account_username)}))
        # accounts = Account.objects.filter(username="testaccount")
        # serializer = AccountSerializer(accounts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_imageUpdateAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.put(
            reverse('image-update', kwargs={'pk': str(self.image_id)}))
        # accounts = Account.objects.filter(username="testaccount")
        # serializer = AccountSerializer(accounts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_accountUpdateAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.put(
            reverse('account-update', kwargs={'username': str(self.account_username)}))
        # accounts = Account.objects.filter(username="testaccount")
        # serializer = AccountSerializer(accounts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_getExcelAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.get(
            reverse('get-excelid', kwargs={'pk': str(self.image_id)}))
        # accounts = Account.objects.filter(username="testaccount")
        # serializer = AccountSerializer(accounts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_handlePinDropsAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        response = c.get(
            reverse('calcPinLocation'), data= self.pins)
        # accounts = Account.objects.filter(username="testaccount")
        # serializer = AccountSerializer(accounts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_measureWidthsAPIRoute(self):
    #     """(Negative)Image List Request"""
    #     c = Client()
    #     # response = c.post(reverse('saveMeasurements'))
    #
    #     response = c.post(
    #         reverse('measureWidths'),
    #         data=json.dumps(self.valid_widths),
    #         content_type='application/json'
    #     )
    #     # accounts = Account.objects.all()
    #     # serializer = ImageSerializer(accounts, many=True)
    #     # self.assertEqual(response.data, serializer.data)
    #     self.assertEqual(response.status_code, 200)


    def test_completeMeasurementsAPIRoute(self):
        """(Negative)Image List Request"""
        c = Client()
        # response = c.post(reverse('saveMeasurements'))

        response = c.post(
            reverse('completeMeasurements'),
            data=json.dumps(self.valid_measurement2),
            content_type='application/json'
        )
        # accounts = Account.objects.all()
        # serializer = ImageSerializer(accounts, many=True)
        # self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, 200)

    # def test_handleBezierFitAPIRoute(self):
    #     """(Negative)Image List Request"""
    #     c = Client()
    #     # response = c.post(reverse('saveMeasurements'))
    #
    #     response = c.get(
    #         reverse('bezierFit'), data=self.valid_path)
    #     # accounts = Account.objects.all()
    #     # serializer = ImageSerializer(accounts, many=True)
    #     # self.assertEqual(response.data, serializer.data)
    #     self.assertEqual(response.status_code, 200)
