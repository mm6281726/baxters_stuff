import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../auth/components/Navigation.css';

const NewestListRedirect = ({ children }) => {
  const [newestListId, setNewestListId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewestList = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/grocerylist/');
        if (response.data && response.data.length > 0) {
          // The lists are already sorted by created_at in descending order
          setNewestListId(response.data[0].id);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching newest grocery list:', err);
        setError('Failed to fetch newest grocery list');
      } finally {
        setLoading(false);
      }
    };

    fetchNewestList();
  }, []);

  // If we're still loading or there was an error, link to the home page
  if (loading || error || !newestListId) {
    return <Link to="/" className="navbar-brand">{children}</Link>;
  }

  // If we have the newest list ID, link to its items page
  return <Link to={`/grocerylist/${newestListId}/items`} className="navbar-brand">{children}</Link>;
};

export default NewestListRedirect;
