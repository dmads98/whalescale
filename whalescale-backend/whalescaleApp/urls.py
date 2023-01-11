from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

from . import views
from . import canvasViews

# Author: Thomas Chemmanoor
# File contains all the url paths for the project as well as the view functions each path is mapped to

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('get-excel/<str:pk>/', views.getExcelID, name='get-excelid'),
    path('login/', obtain_auth_token, name='login'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('account-list/', views.accountList, name='account-list'),
    path('account-detail/<str:username>/', views.accountDetail, name='account-detail'),
    path('account-create/', views.accountCreate, name='account-create'),
    path('account-update/<str:username>/', views.accountUpdate, name='account-update'),
    path('account-delete/<str:username>/', views.accountDelete, name='account-delete'),
    path('image-list/', views.imageList, name='image-list'),
    path('image-detail/<str:pk>/', views.imageDetail, name='image-detail'),
    # path('image-create/', views.imageCreate, name='image-create'),
    path('image-update/<str:pk>/', views.imageUpdate, name='image-update'),
    path('image-delete/<str:pk>/', views.imageDelete, name='image-delete'),
   # path('measure/', views.measure, name='measure'),
    path('bezierFit', canvasViews.handleBezierFit,name='bezierFit'),
    path('measureWidths', canvasViews.handleMeasureWidths,name='measureWidths'),
    path('calcPinLocation', canvasViews.handlePinDrop,name='calcPinLocation'),
    path('completeMeasurements', canvasViews.completeMeasurements,name='completeMeasurements'),
    path('uploadImages/<str:pk>/', views.uploadImages)

]
