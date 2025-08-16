import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UploadForm from './UploadForm.jsx';
import PhotoGallery from './PhotoGallery.jsx';

export default function App() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios.get('/api/photos').then(res => setPhotos(res.data));
  }, []);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await axios.post('/api/photos', formData);
    setPhotos(prev => [...prev, res.data]);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Camila García - Portafolio</h1>
      <UploadForm onUpload={handleUpload} />
      <PhotoGallery photos={photos} />
    </div>
  );
}
