const fs = require('fs');
const path = require('path');

let error;

// DOM Elements
var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnDelete = document.getElementById('btnDelete');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');

// Directory to store files
let pathName = path.join(__dirname, 'Files');
if (!fs.existsSync(pathName)) {
  fs.mkdirSync(pathName);
}

// Create File
btnCreate.addEventListener('click', function () {
  let filePath = path.join(pathName, (fileName.value + ".txt"));
  let content = fileContents.value;
  
  fs.writeFile(filePath, content, function (err) {
    if (err) {
      noty = "Error: " + err.message;
      document.getElementById('noty').innerHTML = noty;
      return;
    }
    noty = `${fileName.value} created successfully!`;
    document.getElementById('noty').innerHTML = noty;
  });
});

// Read File
btnRead.addEventListener('click', function () {
  let filePath = path.join(pathName, (fileName.value + ".txt"));
  
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      noty = "Error: " + err.message;
      document.getElementById('noty').innerHTML = noty;
      return;
    }
    fileContents.value = data;
    noty = `${fileName.value} can be edited!`;
    document.getElementById('noty').innerHTML = noty;
  });
});

// Delete File
btnDelete.addEventListener('click', function () {
  let filePath = path.join(pathName, (fileName.value + ".txt"));
  
  fs.unlink(filePath, function (err) {
    if (err) {
      noty = "Error: " + err.message;
      document.getElementById('noty').innerHTML = noty;
      return;
    }
    fileName.value = '';
    fileContents.value = '';
    noty = `${fileName.value} deleted successfully!`;
    document.getElementById('noty').innerHTML = noty;
  });
});

// Read all CRUD file
function readAllTextFiles() {
  const folderPath = path.join(__dirname, 'Files');
  const files = fs.readdirSync(folderPath); // Get all files in the folder

  const textContents = files
      .filter(file => file.endsWith('.txt')) // Filter only .txt files
      .map(file => {
          const filePath = path.join(folderPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          return { fileName: file, content: content }; // Return file name and content
      });

  return textContents; // Array of objects with file name and content
}

// Update file content
function updateFileContent(fileName, newText) {
  const filePath = path.join(__dirname, 'Files', fileName);
  fs.writeFileSync(filePath, newText, 'utf8');
  location.reload(); // Reload page to show updated content
}

// Delete file
function removeFile(fileName) {
  const filePath = path.join(__dirname, 'Files', fileName);
  fs.unlinkSync(filePath);
  location.reload(); // Reload page to show updated list
}

