import React, { useState, useEffect } from "react";
import "./App.css";

interface Item {
  id: number;
  name: string;
  description: string;
  price: {
    coin: "R$" | "$" | "€";
    value: number;
  };
  status: string;
}

interface PaginatedData {
  items: Item[];
  total: number;
  page: number;
  limit: number;
}

const fetchItems = async (
  page: number,
  limit: number
): Promise<PaginatedData> => {
  const response = await fetch(
    `http://localhost:3001/api/items?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchItems(page, limit);
        console.log("Fetched data:", data); // Adicionado para depuração
        setItems(data.items);
        setTotal(data.total);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    getItems();
  }, [page, limit]); // Adicionado 'page' na dependência do useEffect

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Item List</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            {!item.price ? (
              <p>Price not available</p>
            ) : (
              <p> {item.price.coin} {item.price.value}</p>
            )}
            <p>{item.status}</p>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <div
            key={index}
            className={`page-number ${page === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </div>
        ))}
        <button onClick={handleNextPage} disabled={page * limit >= total}>
          Next
        </button>
      </div>
      <div className="current-page-indicator">
        Página {page} de {totalPages}
      </div>
    </div>
  );
};

export default App;
