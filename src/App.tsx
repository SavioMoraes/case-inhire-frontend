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
      try {
        const data = await fetchItems(page, limit);
        setItems([...items, ...data.items]);
        setTotal(data.total);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    getItems();
  }, [limit]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

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
        {items.map((item, key) => (
          <li key={key}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>
              {item.price.coin} {item.price.value}
            </p>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={page * limit >= total}>
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
