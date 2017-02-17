# PJ Machine
==========
The PJ Machine (Publishing Jockey Machine) is a box with arcade buttons to control a node js web interface for live publishing. 
Made with [Constant](http://www.constantvzw.org/site/?lang=en) and love. 

![PJ Machine](https://github.com/sarahgarcin/pj-machine/blob/master/content/data/02/01.jpg)

## Installation

_You need [node.js](https://nodejs.org/) and [python 2.7](https://www.python.org/) to install.

#### 1. Download this repository

Click on *Clone or Download* in the top right corner of this page, then *Download ZIP*. Unpack this folder.

#### 2. Open a terminal window

Open a terminal window to execute commands and install the programm.

- macOS: go to Applications -> Utilities -> Terminal
- Linux: use a terminal app such as Terminal or Konsole

In your terminal, navigate to the pj-machine folder with your terminal using the `cd` command:
```
cd path/to/pj-machine
```

#### 3. Install dependencies

Install dependencies (may take up to 5 minutes):
```
npm install
```  
 
#### 4. Run PJ Machine

Start the node server folder with the following command:
```
node server.js
```
Go to http://localhost:1337 in your favorite browser

## Documentation
Work in Progress.

### Buttons
Normally you should control the PJ Machine programm with the PJ Machine Box.   
You can also control it with your keyboard.  
e -> select the block you want to act on  
o -> Previous content   
p -> Next content  
a -> Move Left  
s -> Move Up  
q -> Move Right  
w -> Move Down  
u -> Zoom In   
Space -> Zoom Out  
i -> Increase the width of the block  
y -> Increase word-spacing  
r -> Descrease word-spacing  
t -> Export the page to pdf  

## License 
 GPL v.3 




