// test code comment
'use strict';

const Busboy = require('busboy');
        field2: 'VALUE2',
	
file_path: index.js
	
chunk_description: This code defines a function to parse multipart form data from a Lambda event using Busboy, extracting file contents and form fields into a structured JSON object.
    }
 */
const parse = (event) => new Promise((resolve, reject) => {
    const busboy = new Busboy({
        headers: {
            'content-type': event.headers['content-type'] || event.headers['Content-Type']
        }
    });
    const result = {
        files: []
    };

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const uploadFile = {};

        file.on('data', data => {
            uploadFile.content = data;
        });

        file.on('end', () => {
            if (uploadFile.content) {
                uploadFile.filename = filename;
                uploadFile.contentType = mimetype;
                uploadFile.encoding = encoding;
                uploadFile.fieldname = fieldname;
                result.files.push(uploadFile);
            }
        });
    });

    busboy.on('field', (fieldname, value) => {
        result[fieldname] = value;
    });

    busboy.on('error', error => {
        reject(error);
    });

    busboy.on('finish', () => {
        resolve(result);
    });

    const encoding = event.encoding || (event.isBase64Encoded ? "base64" : "binary");

    busboy.write(event.body, encoding);
    busboy.end();
});

module.exports.parse = parse;