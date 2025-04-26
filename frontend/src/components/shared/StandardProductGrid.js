import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import '../../assets/styles/shared/_mergedProductGrid.scss';

// Preinstalled list of categories 
const categories = [
  'All',
  'Home Decor',
  'Jewelry',
  'Art',
  'Fashion',
  'Accessories',
  'Toys',
  'Pottery',
  'Woodwork',
  'Electronics',
  'Books',
  'General'
];

const StandardProductGrid = ({ onDetails, onAddToWishlist, onAddToCart }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTags, setSearchTags] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // '' | 'asc' | 'desc'

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/products');
        if (!response.data || response.data.length === 0) {
          // Dummy products if API returns empty.
          const dummyProducts = [
            { 
              _id: '1', 
              name: 'Product A', 
              price: 9.99, 
              image: 'https://picsum.photos/300/200?random=1',
              category: 'General',
              tags: ['dummy']
            },
            { 
              _id: '2', 
              name: 'Product B', 
              price: 14.99, 
              image: 'https://picsum.photos/300/200?random=2',
              category: 'Home Decor',
              tags: ['decor']
            },
            { 
              _id: '3', 
              name: 'Product C', 
              price: 7.99, 
              image: 'https://picsum.photos/300/200?random=3',
              category: 'Art',
              tags: ['art', 'handmade']
            }
          ];
          setAllProducts(dummyProducts);
        } else {
          setAllProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching products, using dummy data:', error);
        const dummyProducts = [
          { 
            _id: '1', 
            name: 'Product A', 
            price: 9.99, 
            image: 'https://picsum.photos/300/200?random=1',
            category: 'General',
            tags: ['dummy']
          },
          { 
            _id: '2', 
            name: 'Product B', 
            price: 14.99, 
            image: 'https://picsum.photos/300/200?random=2',
            category: 'Home Decor',
            tags: ['decor']
          },
          { 
            _id: '3', 
            name: 'Product C', 
            price: 7.99, 
            image: 'https://picsum.photos/300/200?random=3',
            category: 'Art',
            tags: ['art', 'handmade']
          }
        ];
        setAllProducts(dummyProducts);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Function to filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...allProducts];

    // Filter by product name (case insensitive)
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }

    // Filter by category (if not "All")
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product =>
        product.category &&
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by tags (split comma-separated searchTags)
    if (searchTags.trim() !== '') {
      const tagArray = searchTags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag !== '');
      filtered = filtered.filter(product => {
        if (!product.tags || product.tags.length === 0) return false;
        const productTags = product.tags.map(t => t.toLowerCase());
        // Return true if any search tag matches
        return tagArray.some(tag => productTags.includes(tag));
      });
    }

    // Sort by price if sortOrder is specified
    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  };

  // Helper to build image URLs.
  const getImageUrl = (image) => {
    if (!image || image.trim() === '') return 'https://via.placeholder.com/300x200?text=No+Image';
    const imgPath = image.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(imgPath)) return imgPath;
    return `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/${imgPath}`;
  };

  const filteredProducts = getFilteredProducts();

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Search by tags (comma separated)..." 
          value={searchTags}
          onChange={(e) => setSearchTags(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p>No products match the current filters.</p>
      ) : (
        <div className="standard-product-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="product-card__image"
              />
              <div className="product-card__content">
                <h3 className="product-card__content__title">{product.name}</h3>
                <p className="product-card__content__price">${product.price}</p>
                <p className="product-card__content__category">
                  Category: {product.category || 'General'}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <p className="product-card__content__tags">
                    Tags: {product.tags.join(', ')}
                  </p>
                )}
              </div>
              {/* Action Icons */}
              <div className="product-card__actions">
                <button
                  className="product-card__action-button wishlist-button"
                  onClick={() => 
                    onAddToWishlist 
                      ? onAddToWishlist(product) 
                      : alert('Added to Wishlist')
                  }
                  title="Add to Wishlist"
                >
                  <Icon name="heart" />
                </button>
                <button
                  className="product-card__action-button cart-button"
                  onClick={() => 
                    onAddToCart 
                      ? onAddToCart(product) 
                      : alert('Added to Cart')
                  }
                  title="Add to Cart"
                >
                  <Icon name="cart" />
                </button>
                {onDetails && (
                  <Button className="details-button" onClick={() => onDetails(product)}>
                    Details
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StandardProductGrid;
