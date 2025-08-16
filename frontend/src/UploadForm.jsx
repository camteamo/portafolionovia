import React from 'react';

export default function UploadForm({ onUpload }) {
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div className="mb-4 text-center">
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}
