// package imports
var fs = require('fs');                 //allows operations on files (file stream)
var xml2js = require('xml2js');         //xml parsing used to convert xml to JSON
var convert = require('xml-js');        //parsing used to convert JSON back to xml
const shell = require('electron').shell;
const path = require('path');


// variables related to file name. Edit thise before running this script.
// xml file should be named '[sitename]-basic-page.xml' ans should be saved to the 'xml-import' folder.
// change the website variable to [sitename]
var website = 'education';
var fileNameLoc = 'xml-import/' + website +'-basic-page.xml';
var modFileNameLoc = 'xml-import/' + website +'-basic-page-modified.xml';


var bodyHtmlObject;                    //xml containing html is converted into JSON and stored in this variable.
var bodyHtmlString;                    //object is converted into a string.  This variable is manipulated throughout this file by functions to scrub the html
var bodyHtmlObjectModified;            //subset of text from within the html string
var bodyHtmlObjectToXml;


// copy the file from the import folder (1) and paste it to the new location (2) using a new filename
fs.createReadStream(fileNameLoc);
    //.pipe(fs.createWriteStream(modFileNameLoc));



// read the newly created file and store it in the 'data' variable as an object
fs.readFile(fileNameLoc, (err, data) => {
    if (err) throw err;
    //console.log(data.toString());

    
    // create a new parser 
    var parser = new xml2js.Parser(); 
   
    
    // pares file into object notation
     parser.parseString(data, function (err, result) {
        
        console.log("\nThere are " + result.nodes.node.length + " pages being parsed.\n");
        bodyHtmlObject = result;
        bodyHtmlString = JSON.stringify(result);  
    });
   
    // perform operations on html string
    removeSpans();
    
    // convert from string back to json back to xml
    bodyHtmlObjectModified = JSON.parse(bodyHtmlString);
    bodyHtmlObjectToXml = convert.json2xml(bodyHtmlObjectModified, {compact: true, spaces: 4});
    
    
    // for testing purposes print the contents of the altered html string
    //console.log("\n\n\n********** New XML file: **********\n");
    //console.log(bodyHtmlObjectToXml);
    
    //create a new xml file which contains our modified html.
    fs.writeFile(modFileNameLoc, bodyHtmlObjectToXml, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was modified and saved successfully!");

        //shell.openItem(path.join(__dirname, modFileNameLoc));
    }); 

});



// functions for parsing and updating html content
function removeSpans() {
    
    //regex for span opening and closing tag
    var spanOpeningTagRegex = /<span[A-Za-z0-9\s=\\"-._:;%]*>/g;
    var spanClosingTagRegex = /<\/span>/g 
    
    //replace span tags with nothing -- essentially deletes them
    bodyHtmlString = bodyHtmlString.replace(spanOpeningTagRegex, '');
    bodyHtmlString = bodyHtmlString.replace(spanClosingTagRegex, '');
    
   
    console.log('The function removeSpans() is complete');
}


