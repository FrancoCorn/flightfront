import React, { createContext, useState, useEffect, useContext } from 'react';
import { url_ip } from '../(tabs)/schools';

export type Aeroclub = {
  id: number;
  nombre: string;
  provincia: string;
  direccion: string;
  latitud: number;
  longitud: number;
  contacto: string;
  categorias: string[];
  maps: string;
  img: string;
  user: string;  
};

interface AeroclubContextType {
  aeroclubs: Aeroclub[];
  loading: boolean;
  fetchAeroclubs: () => void;
}

const AeroclubContext = createContext<AeroclubContextType | undefined>(undefined);

export const AeroclubProvider = ({ children }: { children: React.ReactNode }) => {
  const [aeroclubs, setAeroclubs] = useState<Aeroclub[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAeroclubs = () => {
    fetch(`${url_ip}/api/aeroclubes/`)
      .then((response) => response.json())
      .then((data) => {
        setAeroclubs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching aeroclubs:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAeroclubs();
  }, []);

  return (
    <AeroclubContext.Provider value={{ aeroclubs, loading, fetchAeroclubs }}>
      {children}
    </AeroclubContext.Provider>
  );
};

export const useAeroclubContext = () => {
  const context = useContext(AeroclubContext);
  if (!context) {
    throw new Error('useAeroclubContext must be used within an AeroclubProvider');
  }
  return context;
};