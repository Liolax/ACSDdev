import React from 'react';
import './RoleSelection.css'; // Create and adjust styles as needed

const RoleSelection = ({ onSelectRole }) => {
  // onSelectRole is a callback to handle role selection (e.g., "buyer" or "seller")
  const handleRoleSelect = (role) => {
    if (onSelectRole) {
      onSelectRole(role);
    }
  };

  return (
    <div className="role-selection">
      <h2>Select Your Role</h2>
      <div className="role-buttons">
        <button onClick={() => handleRoleSelect('buyer')}>Buyer</button>
        <button onClick={() => handleRoleSelect('seller')}>Seller</button>
      </div>
    </div>
  );
};

export default RoleSelection;
