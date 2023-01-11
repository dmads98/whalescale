WhaleScale v.1.0 Release Notes


# Current Functionality

WhaleScale employs MorphimetriX tools in order to measure whale length, area, body condition, widths, and angles
within an image captured by drones. It uses the following features to accomplish this.

### File Drop

Users can file drop one jpg or png at a time that contains an image of a whale. The file must have a pixel resolution
of over 500 px by 500 px. Upon an upload, if the file does not meet this parameters, the user will be alerted by a snackbar.
Upon a successful upload, the application will pass the file along to the canvas application.

### Canvas

The canvas application accepts the file prop and overlays a vector drawing environment that users can use to 
apply measurements. Within the vector drawing environment, users can drop pins to draw vectors or polygons that
simulate the lengths or areas of a whale morphological feature, such as a fluke or a patch. Users can specify
that this vector or polygon follows a Bezier fit, which automatically reassembles the vectors or sides into one
concurrent, curved line or shape--a Bezier fit. When Bezier fit is enabled, the user can apply widths to the 
Bezier fit vector, which bisects or intersects the vector as many times as the user specifies in the text fields
on the left hand side of the canvas. Users can add parameters to the side menu (a series of Textfields to the
left of the canvas) such as pixel dimension (mm/ppx), altitude (m), and focal length (mm) that the back end algorithms
will use to calculate real world measurements of the whale's body conditions after the user clicks submit. All results
are saved to the users' device as a xlxs or csv file, and users can download their overlayed vector environment
with their image upon successful calculation as well. 

### User features

Users have the option of registering an account with WhaleScale. Benefits of registering is having the WhaleScale
application store your calculations on a database that users can access from their account. Logged in users can
access a Dashboard features where all past calculations are able to be viewed and re-downloaded.

## Known Bugs

While there are no known bugs at this time, it is important to specify that apply widths only works when the user 
has enabled Bezier fit and the user presses enter upon successful drawing of a vector.

## Assumptions

We assume that the user needs no onboarding to the site and will reuse WhaleScale with high frequency. As WhaleScale
is a research tool, our users will most likely be researchers who have a critical understanding of MorphimetriX and its 
specificities, and thus will have a deep and sufficient understanding of how to use our site. They will often have 
hundreds of whales to measure. As a result, there is little on the way of explanation of our functionality; just a tutorial 
for how to use it.

## Limitations

A limitation of the application is that there is little to no catching for poorly dropped pins or error catching 
within the canvas application. Users are free to draw their vectors however they like, but no snackbar appears to
warn them if they have deleted an important vector. Another limitation is that when users drop another file into
the File Drop, whatever calculations have been evaluated in the last file drop will be irrecoverable unless the user
was logged in; the calculations and related files have been popped to make room for the new files.

## Tested Platforms

WhaleScale has been tested for Microsoft Edge, Firefox, and Chrome. It uses a Selenium testing framework. 
Its creators are confident in its accuracy.
