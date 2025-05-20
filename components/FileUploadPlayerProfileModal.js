import Image from "next/image";
import { useState, useEffect } from "react";
import Modal from "react-modal";

export default function FileUploadPlayerProfileModal({
  initData,
  isOpen,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState(initData || {});
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileURL, setFileURL] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormData(initData);
  }, [initData]);

  const handleFileChange = (event) => {
    const newFiles = { ...files };
    newFiles[index] = event.target.files[0];
    setFile(newFiles);
    // setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    setIsUploading(true);
    setError(null);
    setMessage("");

    if (!file) {
      setError("Please select a file.");
      setIsUploading(false);
      return;
    }
    if (file.size > 1024 * 1024) {
      // 1MB limit
      setError("File size should be less than 1MB.");
      setIsUploading(false);
      return;
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `<span class="math-inline">\{Math\.random\(\)\}\.</span>{fileExt}`;
      const filePath = `images/${fileName}`; //--Define the path in your storage bucket

      const { data, error } = await supabase.storage
        .from("images") //--Replace 'your_bucket_name' with the name of your storage bucket in Supabase
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading image:", error);
        return null;
      }

      //--Construct the public URL of the uploaded image
      //   const publicUrl = `<span class="math-inline">\{process\.env\.NEXT\_PUBLIC\_SUPABASE\_URL\}/storage/v1/object/public/</span>{data.Key}`;
      const { data: url } = await supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      console.log("Public URL", url.publicUrl);
      setFileURL(url.publicUrl);
      setMessage("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSubmit(formData);
  // };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Player Form"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10 overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      ariaHideApp={false}
    >
      <form onSubmit={handleFileUpload} className="space-y-6">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10 overflow-y-auto">
          <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl mb-4 text-white text-center">
              Profile Images
            </h2>
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="mb-4 flex items-center">
                <div className="w-16 h-16 mr-4">
                  <Image
                    src="/images/default.jpg"
                    alt={`Profile ${num}`}
                    width={64}
                    height={64}
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-white">Image-{num}</p>
                  <div className="flex items-center">
                    <label
                      htmlFor={`picture-${num}`}
                      className="cursor-pointer bg-gray-600 text-white py-1 px-3 rounded mr-2"
                    >
                      Upload Image
                    </label>
                    <div className="border border-gray-600 rounded flex-grow">
                    <input
                      type="file"
                      id={`picture-${num}`}
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, num)}
                      className="hidden"
                    />
                    <span className="text-white text-sm px-2 py-1 block truncate">
                      {file && file[num] ? file[num].name : "No file chosen"}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-b border-gray-700 px-2 my-4"></div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bg-blue-700"
              >
                Save
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onRequestClose={onClose}
  //     contentLabel="Player Form"
  //     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10 overflow-y-auto"
  //     overlayClassName="fixed inset-0 bg-black bg-opacity-75"
  //     ariaHideApp={false}
  //   >
  //     <div>
  //       <input type="file" onChange={handleFileChange} />
  //       <button onClick={handleFileUpload} disabled={isUploading}>
  //         {isUploading ? "Uploading..." : "Upload"}
  //       </button>
  //       <br />
  //       <br />
  //       <br />
  //       <br />
  //       {fileURL && (
  //         <div>
  //           <p style="color: red">File Uploaded to : {fileURL}</p>
  //           <Image
  //             src={fileURL}
  //             alt="Uploaded Image"
  //             width="300px"
  //             height="auto"
  //           />
  //         </div>
  //       )}
  //     </div>
  //   </Modal>
  // );
}
