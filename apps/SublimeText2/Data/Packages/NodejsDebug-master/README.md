a  simple plugin for sublime text2 to debug node file  in  WebKit based browser.(os:window)

## Getting Started


### Requirements

* [nodeJS](http://github.com/ry/node) version >0.6.0 
* [npm](http://github.com/isaacs/npm)
* [node-inspector](https://github.com/dannycoates/node-inspector)
* A WebKit based browser: Chrome, Safari, etc.

### Install 

1. install node-inspector (global mode) with npm

        $ npm install -g node-inspector
        
   ps: if you have trouble with  node-inspector when installing in  windowxp or window7, you can find answer in this link:
   http://stackoverflow.com/questions/11695739/installing-node-inspector-on-windows

2. download this plugin and unzip it . open the packages folder  by  clicking  the Preferences > Browser packages... entry in your sublime text2. then copy unziped folder in this folder. 

3. open  the  'nodejs_debug.sublime-settings'  file in plugin folder and set the parameter 'chrome_path' using your browser path!

### Debugging

1. open a node.js file in sublime text 2

2. press ctrl+alt+b or click  item 'Nodejs Debug' on  contextmenu 

then you can debug your code in browser .




  