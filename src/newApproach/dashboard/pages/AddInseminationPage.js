// /var/www/amicusapp-frontend/src/newApproach/dashboard/pages/AddInseminationPage.js
import React, { useState } from 'react';
import AddInseminationModal from './AddInseminationModal';
import { useNavigate } from 'react-router-dom';

const AddInseminationPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    // Po zamknięciu modala możesz przekierować użytkownika np. do listy inseminacji
    navigate('/dashboard/inseminations');
  };

  return (
    <div>
      <AddInseminationModal isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export default AddInseminationPage;
