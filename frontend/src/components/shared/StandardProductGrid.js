import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import defaultImage from '../../assets/images/default-product.png';
import '../../assets/styles/shared/_mergedProductGrid.scss';

const categories = [
  'All', 'Home Decor', 'Jewelry', 'Art', 'Fashion', 'Accessories', 'Toys',
  'Pottery', 'Woodwork', 'Electronics', 'Books', 'General'
];

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

const getImageUrl = (image) => {
  if (!image || image.trim() === '') return defaultImage;
  const imgPath = image.replace(/\\/g, '/');
  if (/^https?:\/\//i.test(imgPath)) return imgPath;
  if (imgPath.startsWith('uploads/')) {
    const slash = backendUrl.endsWith('/') ? '' : '/';
    return `${backendUrl}${slash}${imgPath}`;
  }
  return defaultImage;
};

const StandardProductGrid = ({ onDetails, onAddToWishlist, onAddToCart }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTags, setSearchTags] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/products');
        if (!response.data || response.data.length === 0) {
          // TEST: Use 12 dummy products for pagination demonstration!
          const dummyProducts = Array.from({length: 12}, (_, i) => ({
            _id: (i+1).toString(),
            name: `Product ${String.fromCharCode(65+i)}`,
            price: (9.99 + i).toFixed(2),
            image: `https://picsum.photos/300/200?random=${i+1}`,
            category: i % 2 === 0 ? 'General' : 'Home Decor',
            tags: i % 3 === 0 ? ['dummy', 'art'] : ['decor']
          }));
          setAllProducts(dummyProducts);
        } else {
          setAllProducts(response.data);
        }
      } catch (error) {
        // Fallback: Same 12 dummy products
        const dummyProducts = Array.from({length: 12}, (_, i) => ({
          _id: (i+1).toString(),
          name: `Product ${String.fromCharCode(65+i)}`,
          price: (9.99 + i).toFixed(2),
          image: `https://picsum.photos/300/200?random=${i+1}`,
          category: i % 2 === 0 ? 'General' : 'Home Decor',
          tags: i % 3 === 0 ? ['dummy', 'art'] : ['decor']
        }));
        setAllProducts(dummyProducts);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const uniqueTags = Array.from(new Set(allProducts.flatMap(product => product.tags || [])));

  const getFilteredProducts = () => {
    let filtered = [...allProducts];
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product =>
        product.category &&
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchTags.trim() !== '') {
      const tagArray = searchTags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag !== '');
      filtered = filtered.filter(product => {
        if (!product.tags || product.tags.length === 0) return false;
        const productTags = product.tags.map(t => t.toLowerCase());
        return tagArray.some(tag => productTags.includes(tag));
      });
    }
    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  // Reset page to 1 on filter change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, searchTags, sortOrder]);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
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
          list="tagSuggestions"
        />
        <datalist id="tagSuggestions">
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products match the current filters.</p>
      ) : (
        <>
          <div className="standard-product-grid">
            {currentProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="product-card__image"
                  crossOrigin="anonymous"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
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
                </div>
                {onDetails && (
                  <div className="details-button__wrapper">
                    <Button className="details-button" onClick={() => onDetails(product)}>
                      Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {totalPages > 1 && filteredProducts.length > 0 && (
            <div className="pagination">
              <button
                className="pagination__arrow"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                type="button"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination__button${currentPage === i + 1 ? ' active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                  type="button"
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="pagination__arrow"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                type="button"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StandardProductGrid;