# drupal-automation #

## Purpose: ##
This code was written to programatically strip bad code from an xml import that contains all of the html from drupal basic pages.  This will save valuable time when migrating a website from one drupal theme into another.  Right now this script will only work for sites that keep the same url when migrating into a new theme.

## Performs the following tasks: ##
* remove `style="..."` from tags
* makes internal links relative
* point internal links to stage site         
* remove target attributes from links
* add `target="_blank"` for attributes outside of uncc.edu domain
* remove `<span>` tags
* remove `<strong>` tags from within header tags 
  * (still needs a little work but catches most strongs)
* remove existing styling from `<table>` tags and add bootstrap classes
  * (cant remove nested tables yet)
* remove `<div>` tags
* makes image `alt="..."` attributes empty 
  * (still need to work on adding alt tags if no alt tag present)

## Requirements: ##
You must have node.js installed on your machine to run this script.  

## Steps to run script: ##
1. Once you have downloaded or cloned the files from github, add your basic page xml export file to the folder titled 'xml-import'
2. Make sure the file is named like: [sitename]-basic-page.xml
    1. (note: sitename as in --> [sitename].d07-stage.uncc.edu)
3. In the main.js file, edit the variable on line 22 to the [sitename] and save the file
4. Open the terminal and navigate to the 'app' folder in this project (drupal-automation/app)
5. Run the command: `npm install` 
    1. This will install all the dependent modules (and a few extra modules--working on cleaning this up)
6. To run the script run this command in the terminal: `node main.js`
    1. This will perform the tasks and create a new output file in the 'xml-import' folder titled '[sitename]-basic-page-modified.xml'
7. You can use this file on the new site as your xml import to hopefully strip out some of the garbage code.

