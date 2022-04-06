import React, { useState, useContext } from 'react';
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [playername, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <AppContext.Provider
      value={{
        players,
        playername,
        setPlayers,
        setName,
        handleCancel,
        showModal,
        setShowModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
