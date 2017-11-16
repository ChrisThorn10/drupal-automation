/*---------------------------------------------------------------------------*/
// package imports
/*---------------------------------------------------------------------------*/

var fs = require('fs');                 //allows operations on files (file stream)
var xml2js = require('xml2js');         //xml parsing used to convert xml to JSON
var convert = require('xml-js');        //parsing used to convert JSON back to xml
var cheerio = require('cheerio');
const shell = require('electron').shell;
const path = require('path');



/*---------------------------------------------------------------------------*/
// variables related to file name. Edit this before running this script.
// xml file should be named '[sitename]-basic-page.xml'
// file should be saved to the 'xml-import' folder.
// change the website variable to [sitename]
/*---------------------------------------------------------------------------*/

/*EDIT THIS */  var website = 'education';
/*EDIT THIS */  var websiteTitle = 'The Cato College of Education';
///*EDIT THIS */  var stageProdSame = true;

var stageSiteUrl = website + '.d07-stage.uncc.edu';

var fileNameLoc = 'xml-import/' + website + '-basic-page.xml';
var modFileNameLoc = 'xml-import/' + website + '-basic-page-modified.xml';



/*---------------------------------------------------------------------------*/
// other variables used throughout the code
/*---------------------------------------------------------------------------*/

var bodyHtmlObject;                    //xml file content stored as JSON
var bodyHtmlString;                    //JSON stored as string. This variable is manipulated by the functiouns throughout this script
var bodyHtmlObjectModified;            //once functions complete, modified String stored as JSON
var bodyHtmlObjectToXml;               //JSON back to XML. This is written to new xml file



/*---------------------------------------------------------------------------*/
// main body functionality
/*---------------------------------------------------------------------------*/

// read the xml file and store it in the 'data' variable as an object
fs.readFile(fileNameLoc, (err, data) => {
    if (err) throw err;
    //console.log(data.toString());

    
    // create a new parser 
    var parser = new xml2js.Parser(); 
   
    
    // pares file into object notation
     parser.parseString(data, function (err, result) {
        
        console.log("\nThere are " + result.nodes.node.length + " pages being parsed.\n");
        bodyHtmlObject = result;                    //store xml object notation in global variable 
        bodyHtmlString = JSON.stringify(result);    //store xml as string for manipulation
    });
   
    // perform operations on html string
    removeStyleAtt();
    makeLinksRelative();
    pointUrlsToStage();
    removeTargetAtt();
    setCorrectTargetAtt();
    removeSpans();
    removeStrongsFromHeaderTags();
    formatTableTags();

    
    
    // convert from string back to json back to xml
    bodyHtmlObjectModified = JSON.parse(bodyHtmlString);
    bodyHtmlObjectToXml = convert.json2xml(bodyHtmlObjectModified, {compact: true, spaces: 4});
    
    
    // for testing purposes print the contents of the altered html string
    //console.log("\n\n\n********** New XML file: **********\n");
    //console.log(bodyHtmlString);
    
    
    //create a new xml file which contains our modified html.
    fs.writeFile(modFileNameLoc, bodyHtmlObjectToXml, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was modified and saved successfully!");

        //shell.openItem(path.join(__dirname, modFileNameLoc));
    }); 

});



/*---------------------------------------------------------------------------*/
// functions for parsing and updating html content
/*---------------------------------------------------------------------------*/

function removeStyleAtt() {
    
    //regex for span opening and closing tag
    var styleAttRegEx = /style=\\"[\w:\s()\.,;\-!%'\\"]*\\"\s*/g;
    
    //replace span tags with nothing -- essentially deletes them
    bodyHtmlString = bodyHtmlString.replace(styleAttRegEx, '');
   
    console.log('All style tags have been removed.');
}


function makeLinksRelative() {
    
    // regex http or https that point to the old site and have a trailing /
    //regex --> /href=\\"https?:\/\/(www\.)?education.uncc.edu(\/)(?!\s)/g
    var hrefInternalRegex = new RegExp("href=\\\\\"https?:\/\/(www\\.)?" + website + ".uncc.edu(\/)(?!\\s)","g");
    
    //replace with "/" to create relative link
    bodyHtmlString = bodyHtmlString.replace(hrefInternalRegex, 'href=\\\"$2');
   
    console.log('Links are now relative.');
}


function pointUrlsToStage() {
    
    var prodUrlRegEx = new RegExp(website + "\\.uncc\\.edu","g");
    //var matches = bodyHtmlString.match(website + ".uncc.edu");
    //console.log(prodUrlRegEx);
    
    bodyHtmlString = bodyHtmlString.replace(prodUrlRegEx, stageSiteUrl);
    console.log('All urls have been pointed to stage.');
    
    //note: this section needs works. if the lable text for the anchor is education.uncc.edu for example it will be changed to display eduction.d07-stage.uncc.edu
}

function removeTargetAtt() {
    
    var targetRegex = /target=\\"_[a-zA-Z]*\\"/g;
    //var matches = bodyHtmlString.match(targetRegex);
    //console.log(matches);
    
    bodyHtmlString = bodyHtmlString.replace(targetRegex, '');
    console.log('All target attributes have been stripped from anchor tags.');
    
}


function setCorrectTargetAtt() {
    
    var targetRegex = /href=\\"[\w\.:\/\-%_]*\\"/g;
    var matches = bodyHtmlString.match(targetRegex);
    var updatedMatches;
    
    for (i in matches){
        if ((!matches[i].includes(".uncc.edu")) && matches[i].includes("http")) {
            updatedMatches = matches[i] + ' target=\\"_blank\\"';
            //console.log(i+ " " + matches[i]);
            //console.log(i+ " " + updatedMatches);
            bodyHtmlString = bodyHtmlString.replace(matches[i], updatedMatches);
        }   
    }
    
    console.log('University links now open in the same window, and external links in a new tab.');
    
}


function removeSpans() {
    
    //regex for span opening and closing tag
    var spanOpeningTagRegex = /<span[A-Za-z0-9\s=\\"-._:;%]*>/g;
    var spanClosingTagRegex = /<\/span>/g; 
    
    //replace span tags with nothing -- essentially deletes them
    bodyHtmlString = bodyHtmlString.replace(spanOpeningTagRegex, '');
    bodyHtmlString = bodyHtmlString.replace(spanClosingTagRegex, '');
    
   
    console.log('All span tags have been removed.');
}


function removeStrongsFromHeaderTags() {
    var findStrongTagsinHeaderTagsRegex = /(<\s*h[1-6]\s*>)([^<]*?)(<strong>)+(.*?)(<\/strong>)+(.*?)(<\/\s*h[1-6]\s*>)/g;
    //console.log(findStrongTagsinHeaderTagsRegex);
    //var matches = bodyHtmlString.match(findStrongTagsinHeaderTagsRegex);
    //console.log(matches);
    
    bodyHtmlString = bodyHtmlString.replace(findStrongTagsinHeaderTagsRegex, '$1$2$4$6$7');
   
    
    console.log('Strong tags within header tags have been removed.');
    
}


function formatTableTags() {  
    var findTableTagRegEx = /<table\s.*?>/g;
    //var matches = bodyHtmlString.match(findTableTagRegEx);
    //console.log(matches);
    bodyHtmlString = bodyHtmlString.replace(findTableTagRegEx, '<table border=\\"0\\" class=\\"table table-bordered table-responsive table-striped\\" style=\\"width:100%\\">');
    
    console.log('Tables are responsive and have additional boostrap styles');
}

