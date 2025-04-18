import React from 'react';
 
const RoleSelection = ({ onSelectRole }) => {
  const handleRoleSelect = (role) => {
    if (onSelectRole) {
      onSelectRole(role);
    }
  };

  return (
    <div className="role-selection">
      <h2 className="role-selection__header">Select Your Role</h2>
      <div className="role-selection__buttons">
        <button className="role-selection__button" onClick={() => handleRoleSelect('buyer')}>
          Buyer
        </button>
        <button className="role-selection__button" onClick={() => handleRoleSelect('seller')}>
          Seller
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
