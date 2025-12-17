import Modal from "./Modal";
import {useState } from "react";



const FileModal = () => {
  const [image, seImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      seImage(e.target.files[0]);
    }
  };

const handleUpload = async () => {
  if (image) {
    console.log('Uploading file...');

    const formData = new FormData();
    formData.append('pfp', image);

    try {
      const result = await fetch('http://localhost:5005/auth/profile-picture', {
        method: 'PUT',
        body: formData,
        credentials: "include"
      });

    } catch (error) {
      console.error(error);
    }
  }
};

  return (
    <Modal title="Search File" size="md">
      <div>
        <p>Note: profile pictures are not fully suported.</p>
        <p>Either use a png or jpeg/jpg. images can't be larger then 2mb. Reload the page for changes to take effect.</p>
        <input id="file" type="file" className="bg-accent text-primary rounded-md cursor-pointer hover:shadow-md p-1" onChange={handleFileChange} />
      </div>
      {image && (
        <section>
          File details:
          <ul>
            <li>Name: {image.name}</li>
            <li>Type: {image.type}</li>
            <li>Size: {image.size} bytes</li>
          </ul>
        </section>
      )}

      {image && (
        <button
          onClick={handleUpload}
          className="bg-accent text-primary font-light text-xl rounded-md cursor-pointer hover:shadow-md p-1"
        >Upload file</button>
      )}
    </Modal>)
};

export default FileModal;