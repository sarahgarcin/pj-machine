path: content/nicolas_maleve/04

----

content: 

----

index: 1

----

zoom: 1

----

xPos: 33.55789473684211

----

yPos: 1.7999999999999998

----

wordSpace: 0

----

nbOfFiles: 1

----

text: ### Vignette 1
A worker connects to the Amazon Mechanical Turk (AMT)1 and selects  an image annotation task2.  She faces a screen where a label and its definition are displayed. When she confirms she has read the information, she is shown another screen where the  label is followed by different definitions. The workflow is regularly interrupted by such control screens as her requester suspects her to work without paying enough attention. When she clicks on the right definition, a list of 300 square images is displayed from which she has to select the ones corresponding to the label. When she decides she has selected all the appropriate images, she  continues to her new task. The list of images she chooses from contains “planted” images. Images that are known to the requester to correspond to the label.  If the worker misses the planted images, her task will be refused and she won't receive the 4 cents the requester pays for it. At least three workers will review the same 300 images for the same label and the images selected by a majority of them will be included in the dataset. The worker will not be notified if her selection matches (or doesn't) another worker's selection. She works in isolation and anonymously.

### Vignette 2
The images and their labels are grouped in classes of objects. A learning algorithm is fed with these data and trained to associate a label and a series of images. It will be shown a series of images containing both matching and non-matching objects. It will be “rewarded” or “penalized” whenever it detects appropriately in the images the object corresponding to the label. Every interpretation that doesn't correspond to the truth stated in the training set will be considered an error. It will be retrained multiple times until it finally matches the most successfully the images according to the ground truth3. It is a very mechanistic approach to training. The machine is rewarded when behaving properly4 and reinforces the kinds of associations that lead it to produce the satisfying answer. It is expected from it to exhibit the proper behavior, not to create a rich internal representation of the problem it needs to solve. 

----

blockSize: 8

----
