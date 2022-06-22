import React, { useState, useContext } from "react";
   
const Context = React.createContext(null);
const UpdateContext = React.createContext(null);

export const useMyContext = () => {
    return useContext(Context);
}

export const useMyUpdateContext = () => {
    return useContext(UpdateContext);
}

export function AppProvider({children}) {
  const [state, setState] = useState({
    authenticated: false,
    userProfile: {}
  });

  const handleStateUpdate = (currentState) => {
      setState(prevState =>  {
          return {...prevState, ...currentState}
      });
   }

  return (
    <Context.Provider value={state}>
       <UpdateContext.Provider value={handleStateUpdate}>
       {children}
      </UpdateContext.Provider>
    </Context.Provider>
  );
}

 
