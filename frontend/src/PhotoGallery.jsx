import React from 'react';

export default function PhotoGallery({ photos }) {
  if (!photos.length) {
    return <p className="text-center text-gray-500">No hay imágenes aún.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {photos.map(photo => (
        <div key={photo.id}>
          <img
            src={`/uploads/${photo.filename}`}
            alt={photo.originalName}
            className="w-full h-auto rounded"
          />
        </div>
      ))}
    </div>
  );
}
