import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import categoriesData from "../data/response1.json";
import productData from "../data/response2.json";

/* ========= IMF INDICATOR EXTRACTOR =========
   Recursively walks response2.json and pulls
   REAL IMF indicator objects (title, cat, freq, unit, region)
*/
const extractIMFIndicators = (node, acc = []) => {
  if (Array.isArray(node)) {
    node.forEach((item) => extractIMFIndicators(item, acc));
  } else if (node && typeof node === "object") {
    if (
      node.title &&
      node.cat &&
      node.freq &&
      node.unit &&
      node.region
    ) {
      acc.push(node);
    }

    Object.values(node).forEach((val) =>
      extractIMFIndicators(val, acc)
    );
  }
  return acc;
};

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

  /* ========= DATA PIPELINE ========= */
  const filteredData = useMemo(() => {
    let rows = [];

    /* ---------- IMF ---------- */
    if (selectedDataset === "IMF") {
      const imfIndicators = extractIMFIndicators(productData);

      rows = imfIndicators.map((item, index) => ({
        id: item.id || index,
        name: item.title,
        category: item.subCat
          ? `${item.cat} / ${item.subCat}`
          : item.cat,
        range: item.freq,
        unit: item.unit,
        coverage: item.region,
      }));

      if (selectedCategory !== "Homepage") {
        rows = rows.filter((row) =>
          row.category?.includes(selectedCategory)
        );
      }
    }

    /* ---------- INDIA & STATES ---------- */
    else {
      rows = (categoriesData.frequent || []).map((item, index) => ({
        id: item.id || index,
        name: item.title,
        category: item.cat || item.subCat || "—",
        range: item.freq || "—",
        unit: item.unit || "—",
        coverage: item.region || item.db || "India",
      }));

      if (selectedCategory !== "Homepage") {
        rows = rows.filter(
          (row) => row.category === selectedCategory
        );
      }
    }

    /* ---------- SEARCH ---------- */
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          row.category?.toLowerCase().includes(q)
      );
    }

    return rows;
  }, [selectedDataset, selectedCategory, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / itemsPerPage)
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const currentUser = localStorage.getItem("currentUser");

  /* ========= UI (UNCHANGED) ========= */
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-900 text-white px-6 py-4 flex items-center gap-6 sticky top-0 z-50">
        <div className="flex items-center space-x-2 min-w-fit">
          <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
            <span className="font-bold">ID</span>
          </div>
          <span className="text-xl font-semibold">indiadatahub.in</span>
        </div>

        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-2xl px-4 py-2 rounded bg-white text-gray-800"
          />
        </div>

        <div className="flex items-center space-x-6 min-w-fit">
          <span className="hover:text-indigo-200 cursor-pointer">Database</span>
          <span className="hover:text-indigo-200 cursor-pointer">Calendar</span>
          <span className="hover:text-indigo-200 cursor-pointer">Help</span>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
              <span className="text-sm">
                {currentUser ? currentUser.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm hover:text-indigo-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <button
            onClick={() => toggleCategory("Economic Monitor")}
            className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-3"
          >
            <span className="flex items-center">
              <span className="mr-2">
                {expandedCategories["Economic Monitor"] ? "▼" : "▶"}
              </span>
              Economic Monitor
            </span>
          </button>

          <select
            value={selectedDataset}
            onChange={(e) => {
              setSelectedDataset(e.target.value);
              setSelectedCategory("Homepage");
              setCurrentPage(1);
            }}
            className="w-full mb-4 px-3 py-2 border rounded bg-white text-sm"
          >
            <option value="ECONOMIC">India & States</option>
            <option value="IMF">IMF</option>
          </select>

          {expandedCategories["Economic Monitor"] && (
            <div className="space-y-1">
              {Object.keys(categoriesData.categories || {}).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded text-sm ${
                    selectedCategory === cat
                      ? "bg-indigo-100 text-indigo-900 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 p-6">
          <div className="bg-white border rounded-lg min-h-[520px] flex flex-col overflow-hidden">
            <table className="w-full flex-1">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    New Releases
                  </th>
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
                      <div className="text-xs text-blue-600">
                        {item.category}
                      </div>
                    </td>
                    <td className="px-4 py-4">{item.range}</td>
                    <td className="px-4 py-4">{item.unit}</td>
                    <td className="px-4 py-4">{item.coverage}</td>
                    <td className="px-4 py-4">📊 📈</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-4 py-3 border-t flex justify-between items-center bg-white">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
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
