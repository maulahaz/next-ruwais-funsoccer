import { useState, useEffect } from "react";
import Modal from "react-modal";

export default function EditPlayerModal({
  initData,
  isOpen,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState(initData || {});

  useEffect(() => {
    setFormData(initData);
  }, [initData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Player Form"
      // className="bg-black flex flex-col items-center justify-center text-white p-4 overflow-y-auto"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10 overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      ariaHideApp={false}
    >
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl mb-4 text-white text-center">
          {initData ? "Edit Data" : "Create Data"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label>Name:</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Alias:</label>
            <input
              name="alias"
              value={formData.alias || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Position:</label>
            <input
              name="position"
              value={formData.position || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Jersey Number:</label>
            <input
              name="jersey_num"
              value={formData.jersey_num || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Origin:</label>
            <input
              name="origin"
              value={formData.origin || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Previous Club:</label>
            <input
              name="prev_club"
              value={formData.prev_club || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="border-b border-gray-700 px-2 my-4"></div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bg-blue-700"
              // className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
