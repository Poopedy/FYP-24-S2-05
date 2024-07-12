import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '897375513411-qtpvd17f123c23h6ds1tlgq54vh8kcoi.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCzixaPBpQVdtI3IhDcLqjvd2Ds3io7ibY';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

function FileListPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      }).then(() => {
        gapi.client.drive.files.list().then((response) => {
          setFiles(response.result.files);
        });
      });
    });
  }, []);

  return (
    <div>
      <h1>Uploaded Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default FileListPage;
