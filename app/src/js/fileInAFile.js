/*
    fileInAFile.js was created by Brandon Delliquadri for CECS 491B Fall 2023

    The top level functions in this are injectFile() and recoverFile(). 
    They are the functions called by the front end.
*/
const fs = require ('fs');
const crypto = require ("crypto");

var divider = "4d75736173686946696c65496e4146696c65456e6372797074696f6e546f6f6c";   //Hex bytes that allow us to find our injected files later

    /*  injectFile
            Arbitrary divider hex is put at the end of the target file's hex 
            along with the entirety of the "filePathIn" file 
    */
    function injectFile(){
        var filePathTarget = document.getElementById('fileTarget').files[0].path;
        var filePathIn = document.getElementById('fileInject').files[0].path;
        //console.log("WE DID IT:" + filePathTarget);
        if(this.findDivider(filePathTarget) == -1){
            var hexTarget = this.readFile(filePathTarget);
            var hexInject = this.readFile(filePathIn);
            var fileName = this.findFileName(filePathIn);
            var fileNameHex = this.convertToHex(fileName);
            var fileNameLength = this.convertToHex("" + fileNameHex.length);
            if(fileNameLength.length < 6){
                fileNameLength = fileNameLength + "00";
            }
            var hexTarget = hexTarget + divider + fileNameLength + fileNameHex + hexInject;
            var buffer = Buffer.from(hexTarget, "hex");
            fs.writeFileSync(filePathTarget,buffer);
            fs.unlinkSync(filePathIn);
            
            return true;
        }
        return false;
    }

    /*  findDivider
            Searches a file's hex for a divider and returns the outcome. -1 if
            file doesn't contain divider
    */
    function findDivider(filePathTarget){
        var hex = this.readFile(filePathTarget);
        return hex.search(divider)
    }

    /*  readFile
            Uses file path to get the hex in string form of the given file.
    */
    function readFile(filePathTarget){
        var hex = fs.readFileSync(filePathTarget);
        return hex.toString('hex');
    }

    /*  detatchFile
            Finds the divider location using findDivider(). Recovers the 6 hex bytes responsible for
            providing length of file name. Uses that length to determing how far the filename substring
            should go from the end of the length bytes. once the filename is recovered it uses that as the
            name of the file the hidden hex is then written to. Write the original hex without the divider 
            and everything after it to the filepathtarget.
    */
    function detachFile(){
        var filePathTarget = document.getElementById('detachTarget').files[0].path;
        var hex = this.readFile(filePathTarget);
        var divLocation = this.findDivider(filePathTarget);
        if(divLocation != -1){
            //Finds the extension hex
            var fileNameLengthHex = hex.substring(divLocation + divider.length, divLocation + divider.length + 6);
            var fileNameLength = this.hexToString(fileNameLengthHex);
            if(fileNameLength[5] == "0" || fileNameLength[4] == "0"){
                fileNameLength = fileNameLength.substring(0,3);
            }
            var fileNameLengthNum = parseInt(fileNameLength);
            console.log(fileNameLengthNum);
            //finds the hidden hex
            var hidHex = hex.substring(divLocation + divider.length + 6 + fileNameLengthNum,hex.length);
            //Finds the original hex
            var targetHex = hex.substring(0,divLocation);
            //var extension = this.findExtension(hexString);
            //var newPath = filePathTarget.concat("hiddenFile" + randomBytes + extension);
            
            //finds original file name
            var fileNameHex = hex.substring(divLocation + divider.length + 6, divLocation + divider.length + 6 + fileNameLengthNum);
            var fileName = this.hexToString(fileNameHex);
            console.log(fileNameHex);
            var hiddenFilePath = this.removeFileName(filePathTarget) + fileName;
            
            var targetBuffer = Buffer.from(targetHex, "hex");
            var buffer = Buffer.from(hidHex, "hex");
            fs.writeFileSync(hiddenFilePath,buffer);
            fs.unlinkSync(filePathTarget);
            fs.writeFileSync(filePathTarget,targetBuffer);
        }
    }

    /*  writeToFile
            Takes in a string of hex data and writes it to a randomly generated
            filename at a given filepath
    */
    function writeToFile(hexString,filePath){
        //var extension = this.findExtension(hexString);
        var randomBytes = _randomBytes(5).toString('hex');
        var newPath = filePath.concat("hiddenFile" + randomBytes);
        
        var buffer = Buffer.from(hexString, "hex");
        fs.writeFileSync(newPath,buffer);
    }

    /*  findFileName
            Returns everything after the last '\' in the filepath. (File name and extension)
    */
    function findFileName(filePath){
        return filePath.substring(filePath.lastIndexOf("\\")+1,filePath.length);
    }

    /*  decimalToHex
            Self explanatory.
    */
    function decimalToHex(n){
        var hex = new Array(100).fill(0);
        var int = 0;
        while(n !== 0){
            var temp = 0;
            temp = n % 16;

            if(temp < 10){
                hex[int] = String.fromCharCode(temp + 48);
                int++;
            } else{
                hex[int] = String.fromCharCode(temp + 87);
                int++;
            }

            n = parseInt(n/16);
        }
        var hexFin = "";

        for(var j = int - 1; j>=0; j--){
            hexFin += hex[j];
        }
        return hexFin
    }

    /*  hexToString
            Returns ASCII translation of hex bytes.
    */
    function hexToString(hex){
        var str = Buffer.from(hex,'hex');
        return str.toString();
    }

    /*  convertToHex
            ASCII to hex translation.
    */
    function convertToHex(str){
        var out = "";
        for(var i=0; i<str.length;i++){
            var char = str[i];
            var temp = char.charCodeAt(0);
            var transf = this.decimalToHex(temp);
            out += transf;
        }

        return out;
    }

    /*  removeFilename
            Takes out everything after the last instance of '\' in a file path.
            Used in detachFile() to put the hidden file in the same location
            as the file it was hidden in.
    */
    function removeFileName(filePath){
        return filePath.substring(0,filePath.lastIndexOf("\\")+1)
    }
