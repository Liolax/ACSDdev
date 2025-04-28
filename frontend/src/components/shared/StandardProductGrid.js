import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import defaultImage from '../../assets/images/default-product.png';
import ImagePopup from '../ui/ImagePopup';
import getImageUrl from '../../helpers/getImageUrl'; // Default import
import '../../assets/styles/shared/_mergedProductGrid.scss';

const categories = [
  'All', 'Home Decor', 'Jewelry', 'Art', 'Fashion', 'Accessories', 'Toys',
  'Pottery', 'Woodwork', 'Electronics', 'Books', 'General'
];

function StandardProductGrid({ products = [], user, onAddToCart, onAddToWishlist, onDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTags, setSearchTags] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // Store the original image path for the popup
  const [popupImagePath, setPopupImagePath] = useState(null);
  const itemsPerPage = 8;

  const uniqueTags = Array.from(new Set(products.flatMap(product => product.tags || [])));

  const getFilteredProducts = () => {
    let filtered = [...products];
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product =>
        product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchTags.trim() !== '') {
      const tagArray = searchTags.split(',').map(tag => tag.trim().toLowerCase());
      filtered = filtered.filter(product => {
        if (!product.tags) return false;
        return tagArray.some(tag => product.tags.map(t => t.toLowerCase()).includes(tag));
      });
    }
    if (sortOrder === 'asc') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, searchTags, sortOrder, products]);

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search by tags (comma separated)..."
          value={searchTags}
          onChange={e => setSearchTags(e.target.value)}
          list="tagSuggestions"
        />
        <datalist id="tagSuggestions">
          {uniqueTags.map(tag => <option key={tag} value={tag} />)}
        </datalist>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
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
            {currentProducts.map(product => {
              const fullImageURL = getImageUrl(product.image);
              return (
                <div className="product-card" key={product._id}>
                  <img
                    src={fullImageURL}
                    alt={product.name}
                    className="product-card__image"
                    crossOrigin="anonymous"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                    style={{ cursor: 'pointer' }}
                    // When the image is clicked, store its path
                    onClick={() => setPopupImagePath(product.image)}
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
                    {user && user.role === 'buyer' ? (
                      <>
                        <button
                          className="product-card__action-button"
                          title="Add to Wishlist"
                          onClick={() => onAddToWishlist && onAddToWishlist(product._id)}
                        >
                          <Icon name="heart" />
                        </button>
                        <button
                          className="product-card__action-button"
                          title="Add to Cart"
                          onClick={() => onAddToCart && onAddToCart(product._id)}
                        >
                          <Icon name="cart" />
                        </button>
                      </>
                    ) : (
                      <div className="details-button__wrapper">
                        <button
                          className="details-button"
                          onClick={() => onDetails && onDetails(product._id)}
                        >
                          Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination__arrow"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                type="button"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
      {popupImagePath && (
        <ImagePopup imagePath={popupImagePath} onClose={() => setPopupImagePath(null)} />
      )}
    </>
  );
}

export default StandardProductGrid;
