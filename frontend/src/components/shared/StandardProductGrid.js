import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import defaultImage from '../../assets/images/default-product.png';
import ImagePopup from '../ui/ImagePopup';
import getImageUrl from '../../helpers/getImageUrl';
import '../../assets/styles/components/shared/_mergedProductGrid.scss';

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

function StandardProductGrid({ products = [], user, onAddToCart, onAddToWishlist, onDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTags, setSearchTags] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [popupImagePath, setPopupImagePath] = useState(null);
  const itemsPerPage = 8;

  // Flatten all tags, split by comma, trim, dedupe, and lowercase for suggestions
  const uniqueTags = Array.from(
    new Set(
      products
        .flatMap(product =>
          (product.tags || [])
            .flatMap(tag =>
              typeof tag === 'string'
                ? tag.split(',').map(t => t.trim())
                : []
            )
        )
        .filter(Boolean)
        .map(tag => tag.toLowerCase())
    )
  );

  const getFilteredProducts = () => {
    let filtered = [...products];

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
      const enteredTags = searchTags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag !== '');

      if (enteredTags.length > 0) {
        filtered = filtered.filter(product => {
          if (!product.tags || product.tags.length === 0) return false;
          // Flatten product tags for matching
          const productTagsLower = product.tags
            .flatMap(tag =>
              typeof tag === 'string'
                ? tag.split(',').map(t => t.trim().toLowerCase())
                : []
            )
            .filter(Boolean);
          return enteredTags.every(enteredTag => productTagsLower.includes(enteredTag));
        });
      }
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

  // Only suggest individual tags that start with the current fragment and are not already entered
  const currentTagFragment = searchTags.includes(',')
    ? searchTags.substring(searchTags.lastIndexOf(',') + 1).trimStart()
    : searchTags.trimStart();
  const filteredTagSuggestions = currentTagFragment
    ? uniqueTags.filter(
        tag =>
          tag.startsWith(currentTagFragment.toLowerCase()) &&
          !searchTags
            .toLowerCase()
            .split(',')
            .map(t => t.trim())
            .includes(tag)
      )
    : [];

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
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tags (e.g. wood, handmade)"
          value={searchTags}
          onChange={e => setSearchTags(e.target.value)}
          list="tagSuggestions"
        />
        <datalist id="tagSuggestions">
          {currentTagFragment.length > 0 &&
            filteredTagSuggestions.slice(0, 10).map(tag => (
              <option
                key={tag}
                value={
                  searchTags.substring(
                    0,
                    searchTags.toLowerCase().lastIndexOf(currentTagFragment.toLowerCase())
                  ) + tag
                }
              />
            ))}
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
        <p className="standard-product-grid__empty-message">No products match the current filters.</p>
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPopupImagePath(product.image)}
                  />
                  <div className="product-card__content">
                    <h3 className="product-card__content__title">{product.name}</h3>
                    <p className="product-card__content__price">${Number(product.price).toFixed(2)}</p>
                    <p className="product-card__content__category">
                      Category: {product.category || 'General'}
                    </p>
                    {product.tags && product.tags.length > 0 && (
                      <p className="product-card__content__tags">
                        Tags: {product.tags.join(', ')}
                      </p>
                    )}
                    <span>Sold by: {product.seller?.name || 'Seller'}</span>
                  </div>
                  <div className="product-card__actions">
                    {user && user.role === 'buyer' ? (
                      <>
                        <button
                          className="product-card__action-button wishlist-button"
                          title="Add to Wishlist"
                          onClick={() => onAddToWishlist && onAddToWishlist(product._id, product.name, product.price, product.image)}
                        >
                          <Icon name="heart" />
                        </button>
                        <button
                          className="product-card__action-button cart-button"
                          title="Add to Cart"
                          onClick={() =>
                            onAddToCart &&
                            onAddToCart(product._id, 1, product.name, product.price, product.image)
                          }
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
