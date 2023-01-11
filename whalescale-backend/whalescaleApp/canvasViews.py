from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import numpy as np
from math import factorial, sqrt
import ast, json
from whalescaleApp.models import Image, Length, Width, Area, Angle

# Create your views here.

@api_view(['POST'])
def completeMeasurements(request):
    if request.method == 'POST':
        objects = request.data['params']['objects']
        focalLength = request.data['params']['focalLength']
        altitude = request.data['params']['altitude']
        pixelDimension = request.data['params']['pixelDimension']
        imageHeight = request.data['params']['imageHeight']
        imageWidth = request.data['params']['imageWidth']
        canvasHeight = request.data['params']['canvasHeight']
        canvasWidth = request.data['params']['canvasWidth']
        imageName = request.data['params']['imageName']

        xScaleFactor = imageWidth/canvasWidth
        yScaleFactor = imageHeight/canvasHeight

        lengths = []
        areas = []
        angles = []
        index = 0
        while index < len(objects):
            obj = objects[index]
            if (obj['measurementtype'] == "length"):
                value = calcLengthMeasurement(obj, focalLength, altitude, pixelDimension, xScaleFactor, yScaleFactor)
                widths = []
                index = index + 1
                if (obj['widthsegments'] != -1):
                    numSegments = obj['widthsegments'] - 1
                    index = index + (numSegments * 2)
                    for i in range(numSegments):
                        widthValue = calcWidth(objects[index], objects[index + 1], focalLength, altitude, pixelDimension, xScaleFactor, yScaleFactor)
                        widths.append(widthValue)
                        index = index + 2
                value["widths"] = widths
                lengths.append(value)
                continue
            elif (obj['measurementtype'] == "angle"):
                value = calcAngleMeasurement(obj)
                angles.append(value)
            elif (obj['measurementtype'] == "area"):
                value = calcAreaMeasurement(obj, focalLength, altitude, pixelDimension, xScaleFactor, yScaleFactor)
                areas.append(value)
            index = index + 1
        loggedIn = not request.user.is_anonymous
        owner = None
        if loggedIn:
            owner = request.user
        imageId = saveToDatabase(owner, imageName, focalLength, altitude, pixelDimension, lengths, areas, angles)
        res = json.dumps({'imageId' : imageId, 'name': imageName, 'lengths': lengths, 'areas': areas, 'angles': angles, 
            'focalLength': focalLength, 'altitude': altitude, 'pixelDimension': pixelDimension}, cls=NumpyEncoder)
        return Response(res)

def saveToDatabase(owner, imageName, focalLength, altitude, pixelDimension, lengths, areas, angles):
    image = Image(name = imageName,
                  focalLength = focalLength,
                  pixelDimension = pixelDimension,
                  altitude = altitude)
    if owner:
        image.owner = owner
    image.save()
    for index in range(len(lengths)):
        length = Length(name = lengths[index]['name'],
                        length=lengths[index]['value'],
                        widthSegments=len(lengths[index]['widths']),
                        bezierFit= lengths[index]['bezierFit'],
                        image = image)
        length.save()
        for widthIndex in range(len(lengths[index]['widths'])):
            width = Width(width = lengths[index]['widths'][widthIndex],
                          length = length)
            width.save()

    for index in range(len(areas)):
        area = Area(name = areas[index]['name'],
                    area= areas[index]['value'],
                    image = image)
        area.save()

    for index in range(len(angles)):

        angle = Angle(name = angles[index]['name'],
                    angle= angles[index]['value'],
                    image = image)
        angle.save()

    return image.id

def calcWidth(pointA, pointB, focalLength, altitude, pixelDimension, xScaleFactor, yScaleFactor):
    xA = pointA['x'] * xScaleFactor
    yA = pointA['y'] * yScaleFactor
    xB = pointB['x'] * xScaleFactor
    yB = pointB['y'] * yScaleFactor
    res = sqrt((xA - xB)**2 + (yA - yB)**2)
    return res * (pixelDimension/1000) * (altitude / (focalLength/1000))

def calcLengthMeasurement(obj, focalLength, altitude, pixelDimension, xScaleFactor, yScaleFactor):
    res = {"name": obj["name"], "bezierFit": obj['bezier']}
    if (obj['bezier']):
        xs = [elem * xScaleFactor for elem in obj['xs']]
        ys = [elem * yScaleFactor for elem in obj['ys']]
        pts = np.array(list(map(combine, xs, ys)))
        x, y = pts[:, 0], pts[:, 1]
        #integrate for length
        l = np.cumsum(np.hypot(np.gradient(x), np.gradient(y)))
        res["value"] = l[-1] * (pixelDimension/1000) * (altitude / (focalLength/1000))
    else:
        path = obj['path']
        xValues = []
        yValues = []
        for i in range(len(path)):
            xValues.append(path[i]['x1'])
            yValues.append(path[i]['y1'])
            if (i == len(path) - 1):
                xValues.append(path[i]['x'])
                yValues.append(path[i]['y'])
        xValues = np.array(xValues) * xScaleFactor
        yValues = np.array(yValues) * yScaleFactor
        valCalc = np.cumsum(np.hypot(np.diff(xValues), np.diff(yValues)))
        res["value"] = valCalc[-1] * (pixelDimension/1000) * (altitude / (focalLength/1000))
    return res

def calcAreaMeasurement(obj, focalLength, altitude, pixelDimension, xScaleFactor, yScaleFactor):
    res = {"name": obj["name"]}
    path = obj['path']
    xValues = np.array(list(elem['x1'] * xScaleFactor for elem in path))
    yValues = np.array(list(elem['y1'] * yScaleFactor for elem in path))
    # Calculate area using shoelace formula 
    value = 0.5 * np.abs(np.dot(xValues, np.roll(yValues, 1)) - np.dot(yValues, np.roll(xValues, 1)))
    scaledValue = value * ((pixelDimension/1000) * (altitude / (focalLength/1000)))**2
    res["value"] = scaledValue
    return res

def calcAngleMeasurement(obj):
    res = {"name": obj["name"]}
    path = obj['path']
    aX = path[0]['x1']
    aY = path[0]['y1']
    bX = path[1]['x1']
    bY = path[1]['y1']
    cX = path[1]['x']
    cY = path[1]['y']
    v1 = np.array([aX - bX, aY - bY])
    v2 = np.array([cX - bX, cY - bY])
    t = np.arccos(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))
    t *= 180 / np.pi
    res["value"] = t
    return res

@api_view(['GET'])
def handleBezierFit(request):
    if request.method == 'GET':
        pathList = request.query_params.getlist("path[]")
        path = []
        for p in pathList:
            pDict = ast.literal_eval(p)
            path.append(pDict)
        xs, ys, m, l = bezierFit(path)
        res = json.dumps({'xs': xs, 'ys': ys, 'm': m, 'l': l}, cls=NumpyEncoder)
        return Response(res)

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def combine(x, y):
    return x, y

def bezierFit(path):
    nt = 2000
    L = posData(np.empty(shape=(0, 0)), np.empty(shape=(0, 0)))
    for i in range(len(path)):
        if i == 0:
            L.update(path[i]["x1"], path[i]["y1"])
        L.update(path[i]["x"], path[i]["y"])
    points = np.vstack((L.x, L.y)).T
    xs, ys, m = bezier_rational(points, nt)
    pts = np.array(list(map(combine, xs, ys)))
    x, y = pts[:, 0], pts[:, 1]
    #integrate for length
    l = np.cumsum(np.hypot(np.gradient(x), np.gradient(y)))
    return xs, ys, m, l



def comb(n, k):
    return factorial(n) / factorial(k) / factorial(n - k)

def bernstein(i, n, t):
    return comb(n,i) * t**(n-i) * (1-t)**i

def bezier_rational(points, nt):

    n = len(points)
    xp = np.array([p[0] for p in points])
    yp = np.array([p[1] for p in points])
    t = np.linspace(0.0, 1.0, nt)

    #Bezier curve
    B = np.array([ bernstein(i,n-1,t) for i in range(0,n) ])
    xb = np.dot(xp, B)[::-1]
    yb = np.dot(yp, B)[::-1]
    
    #Analytic gradient for bezier curve
    Qx = n*np.diff(xp)
    Qy = n*np.diff(yp)
    Bq = np.array([ bernstein(i,n-2,t) for i in range(0,n-1) ])
    dxb = np.dot(Qx, Bq)[::-1]
    dyb = np.dot(Qy, Bq)[::-1]

    m = np.vstack((dxb,dyb))
    m *= (1/np.linalg.norm(m,axis=0))
    return xb, yb, m

@api_view(['POST'])
def handleMeasureWidths(request):
    if request.method == 'POST':
        xs = request.data['params']['xs']
        ys = request.data['params']['ys']
        m = request.data['params']['m']
        l = request.data['params']['l']
        numSegments = request.data['params']['numSegments']
        canvasHeight = request.data['params']['canvasHeight']
        canvasWidth = request.data['params']['canvasWidth']
        
        lines, xp, yp, slopes = measureWidths(xs, ys, m, l, numSegments, canvasHeight, canvasWidth)
        res = json.dumps({'lines': lines, 'xp': xp, 'yp': yp, 'slopes': slopes}, cls=NumpyEncoder)
        return Response(res)

def measureWidths(xsArr, ysArr, mArr, lArr, numwidths, canvasHeight, canvasWidth):
    xs = np.array(xsArr)
    ys = np.array(ysArr)
    m = np.array(mArr)
    l = np.array(lArr)
    k = 0
    #number of possible measurements per segment (length + #widths)
    #self.measurements[-1] = np.append( self.l[-1], np.zeros(self.numwidths-1)*np.nan ) #preallocate measurements
    # widths = np.empty(numwidths, dtype='float') #preallocate measurements
    # nspines = 2 * (numwidths - 1)

    #get pts for width drawing
    bins = np.linspace(0, l[-1], numwidths + 1)
    inds = np.digitize(l, bins)
    __, inddec = np.unique(inds, return_index=True)

    pts = np.array(list(map(combine, xs, ys)))
    x, y = pts[:, 0], pts[:, 1]

    xp, yp = x[inddec], y[inddec]
    slopes = m[:,inddec]

    L = canvasWidth
    H = canvasHeight

    #Draw Widths
    lines = []
    for k,(x,y) in enumerate(zip(xp[1:-1], yp[1:-1])):
        
        x1, y1 = x,y
        v = slopes[:,k+1]
        vx =  v[1]
        vy = -v[0]
        t0 = np.hypot(L,H)
        t2 = 0

        #intersect: rectangle
        for offset in ([0,0],[L,H]):
            for ev in ([1,0],[0,1]):
                A = np.matrix([ [vx, ev[0]] , [vy, ev[1]] ])
                b = np.array([offset[0] - x1, offset[1] - y1])
                T = np.linalg.solve(A,b)[0]
                t0 = min(T, t0, key=abs) #find nearest intersection to bounds
        
        #Find 2nd furthest intersection within bounds
        bounds = np.array( [(L - x1)/vx, (H - y1)/vy, -x1/vx, -y1/vy] ) 
        t2 = max(-t0, np.sign(-t0)* np.partition(bounds,-2)[-2], key=abs)

        x0 = x1 + t0*vx
        y0 = y1 + t0*vy
        x2 = x1 + t2*vx
        y2 = y1 + t2*vy

        for l, (a, b) in enumerate(zip([x0, x2], [y0, y2])):
            start = [x1, y1]
            end = [a, b]
            ln = {'start' : start, 'end': end}
            lines.append(ln)
    return lines, xp, yp, slopes

# do we need to extend lines to image border???     
# def extendLine(x1, y1, x2, y2, L, H):
#     if (x2 <= 0 or x2 >= L or y2 <=0 or y2 >= H):
#         return x2, y2
#     else:
#         print("shortline")
#         return x2, y2

class posData():

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def update(self, add_x, add_y):
        self.x = np.append(self.x, add_x)
        self.y = np.append(self.y, add_y)

@api_view(['GET'])
def handlePinDrop(request):
    if request.method == 'GET':
        x0 = float(request.query_params['x0'])
        y0 = float(request.query_params['y0'])
        x1 = float(request.query_params['x1'])
        y1 = float(request.query_params['y1'])
        vx = float(request.query_params['vx'])
        vy = float(request.query_params['vy'])
        A = np.matrix([[vx, -vy], [vy, vx]])
        b = np.array([x1 - x0, y1 - y0])
        t = np.linalg.solve(A,b)

        xi = x0 + t[0]*vx
        yi = y0 + t[0]*vy
        res = {"x": xi, "y": yi}
        return Response(res)
