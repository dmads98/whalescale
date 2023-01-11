User Documentation: Documentation for new Users.

Welcome to WhaleScale! 

This document will teach you all you need to know to get started measuring a whale right from your own browser.

First of all, what is WhaleScale?

WhaleScale is a project sponsored by the Duke Marine Lab, a subset of the Duke Nicholas School of the Environment. It aspires to connect you, the public, with the tools to humanely and safely measure whales from drone images, right on your own computer. WhaleScale uses software inspired by MorphimetriX, an image processing program developed by marine megafauna researchers Walter Torres and KC Bierlich. Like ImageJ and other UAS photogrammetry tools, MorphimetriX and by extension WhaleScale give you the user to draw vectors and measure whales.

Now that you know all that, how do we do it? How do we measure whales?

Image Size

First, you need an image of a whale. This may seem easy at first, but not just any whale will do. You need a jpg or png file of a whale that is greater than 500 by 500 pixels in dimension. Additionally, you need to make sure the whale in frame is not oblique; in other words, you need to view the whale from top down, not from the side.
How to
Next, we need to fill out our parameters. No matter what whale image you capture, it’s important that you record several important parameters so the calculator knows how to apply it!

First, you need the altitude from which you took the photo in meters, and the focal length of your camera in millimeters.

Next, you need the pixel dimension of the photo itself, measured in millimeters per pixel. Don’t worry if you don’t know off the top of your head; we will autogenerate it for you! 

Next, you need the widths. This is important for measuring individual components of your whale. It can be any number you want; the software will divide your image into equal components set to the number you specify. If you want to measure your whale in quarters, put 4. If you want to be more specific, just specify! Enable that on your previous vector you have enabled Bezier fit so the widths know which vector to intersect.

Now, you can measure your whale by drawing vectors on your drone image! Draw vectors that mimic the curvature of the whale or its individual features, 
such as its fluke or its unique characteristics. Enable Bezier Fit on vectors that need a curve versus a vector. Measure angles by clicking
the measure angles button. When you are ready, click calculate! Then you can download your measurements as a csv or an image.

User FAQ

Q: How does WhaleScale make its measurements?

A: WhaleScale uses the conceptual framework behind MorphimetriX, an image processing program developed by marine megafauna researchers at the
Duke Marine Robotics Lab, Walter Torres and KC Bierlich. Their research and documentation has been documented at this site, (https://joss.theoj.org/papers/10.21105/joss.01825). The conceptual framework and logic behind it has been published and peer reviewed at the Journal of Open Source Software.

Q: Who has access to my measurements?

A: While WhaleScale saves copies of measurement files within its database, WhaleScale does not use any of it for scientific research or publication purposes, nor does it lay claim to the intellectual property of the users, including their measurements. Users can trust that all user data is used
only for authentification and safety purposes.

Q: What if I can't remember my password?

A: Reach out to the database manager for technical support. 

HowTo Video: How to Use WhaleScale made available by clicking the "Tutorial" option on the site.





