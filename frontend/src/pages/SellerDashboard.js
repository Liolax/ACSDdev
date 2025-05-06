import React, { useEffect, useState } from 'react';
import { getMySales, getOrdersToShip, markShipped } from '../api/orders/ordersRequests';
import { createProduct, updateProduct } from '../api/products/productRequests';

// Import SCSS for the seller dashboard
import '../assets/styles/pages/_seller-dashboard.scss';

export default function SellerDashboard() {
  const [sales, setSales] = useState([]);
  const [toShip, setToShip] = useState([]);

  useEffect(() => {
    getMySales().then(res => setSales(res.data));
    getOrdersToShip().then(res => setToShip(res.data));
  }, []);

  const handleMarkShipped = (orderId, orderItemId) => {
    markShipped(orderId, orderItemId).then(() => {
      getOrdersToShip().then(res => setToShip(res.data));
      getMySales().then(res => setSales(res.data));
    });
  };

  return (
    <div className="seller-dashboard">
      <section className="seller-dashboard__section">
        <h2 className="seller-dashboard__title">My Sales</h2>
        <div className="panel">
          <div className="panel__content">
            {sales.length > 0 ? sales.flatMap(order =>
              order.orderItems.map(item => (
                <div className="sale-item" key={item._id}>
                  <div className="sale-item__product-name">{item.productId?.name || 'Product Name Unavailable'}</div>
                  <div className={`sale-item__status sale-item__status--${item.status?.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </div>
                  {item.feedback && (
                    <div className="sale-item__feedback">
                      <div className="sale-item__feedback-rating">
                        Rating: {item.feedback.rating}★
                      </div>
                      <div className="sale-item__feedback-comment">{item.feedback.comment}</div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="seller-dashboard__empty">
                No sales yet. Your sales will appear here when available.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="seller-dashboard__section">
        <h2 className="seller-dashboard__title">Orders to Ship</h2>
        <div className="panel">
          <div className="panel__content">
            {toShip.flatMap(order => order.orderItems).length > 0 ? toShip.flatMap(order =>
              order.orderItems.map(item => (
                <div className="order-to-ship-item" key={item._id}>
                  <div className="order-to-ship-item__product-name">{item.productId?.name || 'Product Name Unavailable'}</div>
                  <div className={`order-to-ship-item__status order-to-ship-item__status--${item.status?.toLowerCase().replace(' ', '-')}`}>
                    Status: {item.status}
                  </div>
                  <div className="order-to-ship-item__actions">
                    <button
                      className="mark-shipped-button"
                      onClick={() => handleMarkShipped(order._id, item._id)}
                      disabled={item.status === 'Shipped'}
                    >
                      Mark Shipped
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="seller-dashboard__empty">
                No orders currently pending shipment.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="seller-dashboard__section">
        <h2 className="seller-dashboard__title">Manage Products</h2>
        <div className="panel">
          <div className="panel__content">
            <p className="seller-dashboard__empty">
              Product management features are coming soon!
            </p>
            {/* 
              Future elements:
              <button className="add-product-button">Add New Product</button>
              <ProductList products={sellerProducts} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
              {isEditing && <ProductForm product={currentProduct} onSubmit={handleUpdateProduct} />}
              {isAdding && <ProductForm onSubmit={handleCreateProduct} />}
            */}
          </div>
        </div>
      </section>
    </div>
  );
}
