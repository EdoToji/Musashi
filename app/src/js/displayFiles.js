var rowN = 0;
var fileData;
let dataArr = []; //array that holds data objects
//adds the file's name and path to the home page table
function addTableRows(input){
        document.getElementById("uploadTable").style.visibility="visible";
        var table = document.getElementById("uploadTable");
        rowN = table.rows.length + 1;
        var row = '<td><input type="text" name="fileName" id="fileName' + rowN + '" value="' + input.files[0].name + '"/></td><td>' + input.files[0].path + '</td>'; 
        table.innerHTML = table.innerHTML + row;  
        rowN++;
        saveJsonFile(input);
}

// function addTableRowsAlt(input){
//     document.getElementById("uploadTable").style.visibility="visible";
//     var table = document.getElementById("uploadTable");
//     rowN = table.rows.length + 1;
//     var row = '<td><input type="text" name="fileName" id="fileName' + rowN + '" value="' + input.fileName + '"/></td><td>' + input.filePath+ '</td>'; 
//     table.innerHTML = table.innerHTML + row;  
//     rowN++;
//     saveJsonFileAlt(input);

// }
//creates data object and writes it to a json file
function saveJsonFile(file) {
    var fname = file.files[0].name;
    let fpath = file.files[0].path;
    //if the json file is empty then push the data to the empty data array and append to json file
    if(fs.readFileSync("app/src/js/fileStorage.json").length === 0){
        let data ={
                fname,
                fpath
        };
        dataArr.push(data);
        let sData = JSON.stringify(dataArr, null, 2);
        fs.appendFileSync("app/src/js/fileStorage.json", sData);
        }
        //if the json file is NOT empty
        else{
                //make the data array empty again
                dataArr = [];
                //read the current contents of the json file and push to data array
                let db = JSON.parse(fs.readFileSync("app/src/js/fileStorage.json"));
                for(let i = 0; i < db.length ;i++){
                        dataArr.push(db[i]);

                }
                //create a new data object
                let data ={
                        fname,
                        fpath
                };
                //push new object to data array
                dataArr.push(data);
                //write data array to json file
                let sData = JSON.stringify(dataArr, null, 2);
                fs.writeFileSync("app/src/js/fileStorage.json", sData);
        }
}

// function saveJsonFileAlt(file) {
//     var fname = file.fileName;
//     let fpath = file.filePath;
//     if(fs.readFileSync("app/src/js/fileStorage.json").length === 0){
//         //dataArr = [];
//         let data ={
//                 fname,
//                 fpath
//         };
//         //let parsed = JSON.parse(db);
//         dataArr.push(data);
//         let sData = JSON.stringify(dataArr, null, 2);
//         fs.appendFileSync("app/src/js/fileStorage.json", sData);
//         }
//         else{
//                 dataArr = [];
//                 let db = JSON.parse(fs.readFileSync("app/src/js/fileStorage.json"));
//                 for(let i = 0; i < db.length ;i++){
//                         dataArr.push(db[i]);

//                 }
//                 let data ={
//                         fname,
//                         fpath
//                 };
//                 dataArr.push(data);
//                 let sData = JSON.stringify(dataArr, null, 2);
//                 fs.writeFileSync("app/src/js/fileStorage.json", sData);
//         }
// }