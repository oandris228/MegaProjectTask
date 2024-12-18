import React, { useState, useMemo, useEffect } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
  }

export default function Products() {
  const [searchQuery, setSearchQuery] = useState<string>(""); // For search input
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const productsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await fetch("http://localhost:3000/products");
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProducts();
        }, []);
  if (loading) return <p>Loading geometries...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  // Handle sorting
  const sortedProducts = useMemo(() => {
    let sortedArray = [...products];

    sortedArray.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sortedArray;
  }, [products, sortConfig]);

  // Handle search filtering
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sortedProducts]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSort = (key: keyof Product) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px" }}
      />
      <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th onClick={() => handleSort("name")}>Név</th>
                    <th onClick={() => handleSort("price")}>Ár</th>
                    <th onClick={() => handleSort("description")}>Leírás</th>
                </tr>
                </thead>
                <tbody>
                {currentProducts.map((product) => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};