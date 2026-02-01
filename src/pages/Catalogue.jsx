import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import categoriesData from "../data/response1.json";
import productData from "../data/response2.json";

function Catalogue() {
  const navigate = useNavigate();

  const [selectedDataset, setSelectedDataset] = useState("ECONOMIC");
  const [selectedCategory, setSelectedCategory] = useState("Homepage");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({
    "Economic Monitor": true,
  });

  const itemsPerPage = 10;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const filteredData = useMemo(() => {
    let filtered = productData.data.filter(
      (item) => item.dataset === selectedDataset
    );

    if (
      selectedCategory !== "Homepage" &&
      selectedCategory !== "All"
    ) {
      filtered = filtered.filter((item) =>
        item.category.includes(selectedCategory)
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [selectedDataset, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentUser = localStorage.getItem("currentUser");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">ID</span>
          </div>
          <span className="text-xl font-semibold">indiadatahub.in</span>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 rounded bg-white text-gray-800"
          />
        </div>

        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-indigo-200">Database</a>
          <a href="#" className="hover:text-indigo-200">Calendar</a>
          <a href="#" className="hover:text-indigo-200">Help</a>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">
                {currentUser ? currentUser.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <button onClick={handleLogout} className="text-sm hover:text-indigo-200">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <button
            onClick={() => toggleCategory("Economic Monitor")}
            className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
          >
            <span className="flex items-center">
              <span className="mr-2">
                {expandedCategories["Economic Monitor"] ? "▼" : "▶"}
              </span>
              Economic Monitor
            </span>
          </button>

          <div className="ml-6 mb-4">
            <select
              value={selectedDataset}
              onChange={(e) => {
                setSelectedDataset(e.target.value);
                setSelectedCategory("Homepage");
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
            >
              <option value="ECONOMIC">India & States</option>
              <option value="IMF">IMF</option>
            </select>
          </div>

          {expandedCategories["Economic Monitor"] && (
            <div className="ml-6 space-y-1">
              {categoriesData.categories[0].children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    setSelectedCategory(child.name);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded text-sm ${
                    selectedCategory === child.name
                      ? "bg-indigo-100 text-indigo-900 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 p-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold">New Releases</th>
                  <th className="px-4 py-3 text-xs font-semibold">Range</th>
                  <th className="px-4 py-3 text-xs font-semibold">Unit</th>
                  <th className="px-4 py-3 text-xs font-semibold">Coverage</th>
                  <th className="px-4 py-3 text-xs font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-blue-600">{item.category}</div>
                    </td>
                    <td className="px-4 py-4">{item.range}</td>
                    <td className="px-4 py-4">{item.unit}</td>
                    <td className="px-4 py-4">{item.coverage}</td>
                    <td className="px-4 py-4">📊 📈</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-gray-50 px-4 py-3 border-t flex justify-between">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <div className="space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalogue;
