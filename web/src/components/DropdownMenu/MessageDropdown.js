import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FiMoreVertical } from "react-icons/fi";
import RevokeModal from "../RevokeModal/RevokeModal"; 
import "./MessageDropdown.scss";

function MessageDropdown({revokeHandler, deleteHandler,}) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false); 

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleRevoke = () => {
    setShowRevokeModal(true); 
  };

  const handleCloseRevokeModal = () => {
    setShowRevokeModal(false); 
  };

  return (
    <>
      <Dropdown show={isOpen} onToggle={handleToggle} className="message-dropdown">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          <FiMoreVertical />
        </Dropdown.Toggle>

        {isOpen && (
          <Dropdown.Menu className="dropdown-menu">
            <Dropdown.Item onClick={deleteHandler}>Xóa</Dropdown.Item>
            <Dropdown.Item onClick={handleRevoke}>Thu hồi</Dropdown.Item> {/* Assign handleRevoke to onClick */}
          </Dropdown.Menu>
        )}
      </Dropdown>
      {/* Render RevokeModal component only when showRevokeModal is true */}
      {showRevokeModal && <RevokeModal onClose={handleCloseRevokeModal} onConfirm={() => {revokeHandler() ;
      handleCloseRevokeModal()
      }} />}
    </>
  );
}

export default MessageDropdown;
