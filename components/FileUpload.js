import Image from "next/image";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUplading] = useState(false);
  const [fileURL, setFileURL] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
};
// return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Player Form"
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10 overflow-y-auto"
//       overlayClassName="fixed inset-0 bg-black bg-opacity-75"
//       ariaHideApp={false}
//     >
//       <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-white">
//           Pictures Profile
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10 overflow-y-auto">
//             <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg max-h-[90vh] overflow-y-auto">
//               <h2 className="text-2xl font-bold mb-4 text-white">
//                 Edit Pictures
//               </h2>
//               <div className="mb-4">
//                 <p className="text-white mb-2">Current Picture:</p>
//                 <img
//                   src={currentImage}
//                   alt={player.name}
//                   className="w-full h-40 object-cover rounded"
//                 />
//               </div>
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <div key={num} className="mb-4">
//                   <label
//                     className="block text-white text-sm font-bold mb-2"
//                     htmlFor={`picture-${num}`}
//                   >
//                     Upload Picture {num}:
//                   </label>
//                   <input
//                     type="file"
//                     id={`picture-${num}`}
//                     accept="image/*"
//                     onChange={(e) => {
//                       // Handle file upload here
//                       console.log(`File ${num} selected:`, e.target.files[0]);
//                     }}
//                     className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-800"
//                   />
//                 </div>
//               ))}
//               <div className="border-b border-gray-700 px-2 my-4"></div>
//               <div className="flex justify-end">
//                 <button
//                   onClick={() => setIsEditPictureModalOpen(false)}
//                   className="px-4 py-2 text-gray-300 hover:text-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     // Handle saving the uploaded pictures here
//                     console.log("Saving pictures...");
//                     setIsEditPictureModalOpen(false);
//                   }}
//                   className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bg-blue-700 ml-2"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );

return (
  <div>
    <input type="file" onChange={handleFileChange} />
    <button onClick={handleFileUpload} disabled={isUploading}>
      {isUploading ? "Uploading..." : "Upload"}
    </button>
    <br />
    <br />
    <br />
    <br />
    {fileURL && (
      <div>
        <p style="color: red">File Uploaded to : {fileURL}</p>
        <Image src={fileURL} alt="Uploaded Image" width="300px" height="auto" />
      </div>
    )}
  </div>
);
