// /var/www/amicusapp-frontend/src/newApproach/dashboard/pages/AddInseminationModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import AsyncSelect from 'react-select/async';
import api from '../../../services/api'; // Upewnij się, że ścieżka jest poprawna

// Przykładowe style modala
const customStyles = {
  content: {
    top: '50%', 
    left: '50%',
    right: 'auto', 
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
};

const AddInseminationModal = ({ isOpen, onClose }) => {
  // Uproszczony sposób pobierania zalogowanego użytkownika
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {
    id: 1,
    first_name: 'Jan',
    last_name: 'Kowalski',
    farm_number: 'FARM123',
    additional_id: 'ADDED456',
  };

  // Stan formularza
  const [ownerId, setOwnerId] = useState(null);
  const [damOwner, setDamOwner] = useState('');
  const [herdNumber, setHerdNumber] = useState('');
  const [herdEvalNumber, setHerdEvalNumber] = useState('');
  const [animalId, setAnimalId] = useState(null);
  const [earTagNumber, setEarTagNumber] = useState('');

  const [bullId, setBullId] = useState(null);
  const [certificateNumber, setCertificateNumber] = useState('');
  const [bullType, setBullType] = useState('');
  const [supplier, setSupplier] = useState('');

  const [procedureDate, setProcedureDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [reInsemination, setReInsemination] = useState(false);

  const [fileNumber, setFileNumber] = useState('');
  const [procedureNumber, setProcedureNumber] = useState('');
  const [lastCalvingDate] = useState('1990-01-01');
  const [name] = useState('Dopisz');
  const [inseminator, setInseminator] = useState('');

  const [symlekStatus] = useState('');
  const [symlekResponsibility] = useState('');

  // Ustawienie domyślnych danych przy otwarciu modala
  useEffect(() => {
    if (isOpen && loggedUser) {
      setInseminator(`${loggedUser.first_name} ${loggedUser.last_name}`);
      const year = new Date().getFullYear();
      setFileNumber(`NR/${year}`);
    }
  }, [isOpen, loggedUser]);

  useEffect(() => {
    if (animalId) {
      fetchProcedureNumber(animalId);
    } else {
      setProcedureNumber('');
    }
  }, [animalId]);

  const fetchProcedureNumber = async (animalIdParam) => {
    try {
      const res = await api.get('/insemination-register/next-procedure-number', {
        params: { animalId: animalIdParam },
      });
      console.log('Procedure number fetched:', res.data);
      setProcedureNumber(res.data.procedureNumber);
    } catch (err) {
      console.error('Błąd pobierania procedure_number:', err);
      setProcedureNumber('');
    }
  };

  // Ładowanie użytkowników (klientów)
  const loadUsers = async (inputValue) => {
    console.log('loadUsers input:', inputValue, 'vetId:', loggedUser.id);
    if (inputValue.length < 3) return [];
    try {
      const res = await api.get('/users', {
        params: {
          search: inputValue,
          limit: 5,
          vetId: loggedUser.id,
        },
      });
      console.log('loadUsers response:', res.data);
      return res.data.map((u) => ({
        value: u.id,
        label: `${u.first_name} ${u.last_name} (${u.city || ''})`,
        raw: u,
      }));
    } catch (err) {
      console.error('Błąd pobierania użytkowników:', err);
      return [];
    }
  };

  const handleSelectUser = (selected) => {
    if (!selected) {
      setOwnerId(null);
      setDamOwner('');
      setHerdNumber('');
      setHerdEvalNumber('');
      setAnimalId(null);
      setEarTagNumber('');
      return;
    }
    const user = selected.raw;
    setOwnerId(user.id);
    setDamOwner(`${user.first_name} ${user.last_name}`);
    setHerdNumber(user.farm_number || '');
    setHerdEvalNumber(user.additional_id || '');
    // Po wybraniu klienta czyścimy dane zwierzęcia
    setAnimalId(null);
    setEarTagNumber('');
    console.log('Selected user:', user);
  };

  // Ładowanie zwierząt klienta
  const loadAnimals = async (inputValue) => {
    console.log('loadAnimals input:', inputValue, 'ownerId:', ownerId);
    if (inputValue.length < 3 || !ownerId) return [];
    try {
      const res = await api.get('/animals', {
        params: {
          ownerId,
          search: inputValue,
          limit: 5,
        },
      });
      console.log('loadAnimals response:', res.data);
      return res.data.map((a) => ({
        value: a.id,
        label: `${a.animal_number} - ${a.name || 'bez nazwy'}`,
        raw: a,
      }));
    } catch (err) {
      console.error('Błąd pobierania zwierząt:', err);
      return [];
    }
  };

  const handleSelectAnimal = (selected) => {
    if (!selected) {
      setAnimalId(null);
      setEarTagNumber('');
      return;
    }
    const animal = selected.raw;
    setAnimalId(animal.id);
    setEarTagNumber(animal.animal_number);
    console.log('Selected animal:', animal);
  };

  // Ładowanie buhajów
  const loadBulls = async (inputValue) => {
    console.log('loadBulls input:', inputValue, 'vetId:', loggedUser.id);
    if (inputValue.length < 3) return [];
    try {
      const res = await api.get('/bulls', {
        params: {
          search: inputValue,
          limit: 5,
          vetId: loggedUser.id,
        },
      });
      console.log('loadBulls response:', res.data);
      return res.data.map((b) => ({
        value: b.id,
        label: `${b.identification_number} (${b.bull_type || ''})`,
        raw: b,
      }));
    } catch (err) {
      console.error('Błąd pobierania buhajów:', err);
      return [];
    }
  };

  const handleSelectBull = (selected) => {
    if (!selected) {
      setBullId(null);
      setCertificateNumber('');
      setBullType('');
      setSupplier('');
      return;
    }
    const bull = selected.raw;
    setBullId(bull.id);
    setCertificateNumber(bull.identification_number || '');
    setBullType(bull.bull_type || '');
    setSupplier(bull.supplier || '');
    console.log('Selected bull:', bull);
  };

  const handleSave = async () => {
    try {
      const payload = {
        owner_id: ownerId,
        animal_id: animalId,
        certificate_number: certificateNumber,
        file_number: fileNumber,
        procedure_number: procedureNumber,
        re_insemination: reInsemination ? 'true' : 'false',
        procedure_date: procedureDate,
        herd_number: herdNumber,
        herd_eval_number: herdEvalNumber,
        dam_owner: damOwner,
        ear_tag_number: earTagNumber,
        last_calving_date: lastCalvingDate,
        name: name,
        bull_type: bullType,
        supplier: supplier,
        inseminator: inseminator,
        symlek_status: symlekStatus,
        symlek_responsibility: symlekResponsibility,
      };

      console.log('Payload to be sent:', payload);
      await api.post('/insemination-register', payload);
      onClose();
    } catch (err) {
      console.error('Błąd zapisu zabiegu inseminacji:', err);
      alert('Wystąpił błąd przy zapisie zabiegu');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Dodaj zabieg inseminacji"
    >
      <h2>Dodaj zabieg inseminacji</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>Klient (owner): </label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadUsers}
          defaultOptions={false}
          onChange={handleSelectUser}
          placeholder="Wpisz min. 3 znaki (imię, nazwisko, adres)"
          isClearable
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Dam Owner (Imię i nazwisko): </label>
        <input type="text" value={damOwner} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Herd Number: </label>
        <input type="text" value={herdNumber} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Herd Eval Number: </label>
        <input type="text" value={herdEvalNumber} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Wybierz zwierzę: </label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadAnimals}
          defaultOptions={false}
          onChange={handleSelectAnimal}
          placeholder="Wpisz min. 3 znaki numeru kolczyka"
          isClearable
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Ear Tag Number: </label>
        <input type="text" value={earTagNumber} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Buhaj: </label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadBulls}
          defaultOptions={false}
          onChange={handleSelectBull}
          placeholder="Wpisz min. 3 znaki (ID buhaja, typ)"
          isClearable
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Certificate Number: </label>
        <input type="text" value={certificateNumber} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Bull Type: </label>
        <input type="text" value={bullType} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Supplier: </label>
        <input type="text" value={supplier} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Data zabiegu: </label>
        <input
          type="date"
          value={procedureDate}
          onChange={(e) => setProcedureDate(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Re-inseminacja? </label>
        <input
          type="checkbox"
          checked={reInsemination}
          onChange={(e) => setReInsemination(e.target.checked)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>File Number: </label>
        <input type="text" value={fileNumber} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Procedure Number: </label>
        <input type="text" value={procedureNumber} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Inseminator: </label>
        <input type="text" value={inseminator} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Last Calving Date: </label>
        <input type="text" value={lastCalvingDate} readOnly />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Name: </label>
        <input type="text" value={name} readOnly />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={handleCancel}>Anuluj</button>
        <button onClick={handleSave}>Zapisz</button>
      </div>
    </Modal>
  );
};

export default AddInseminationModal;
