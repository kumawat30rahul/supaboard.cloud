import { createContext, ReactNode, useContext, useState } from "react";

interface DataContextProps {
  bestReactionTime: number;
  currentReactionTime: number;
  recordedVideos: string[];
  setBestReactionTime: (time: number) => void;
  setCurrentReactionTime: (time: number) => void;
  setRecordedVideosContext: (videos: string[]) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useDataContext = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [bestReactionTime, setBestReactionTime] = useState(0);
  const [currentReactionTime, setCurrentReactionTime] = useState(0);
  const [recordedVideos, setRecordedVideosContext] = useState<string[]>([]);

  return (
    <DataContext.Provider
      value={{
        bestReactionTime,
        currentReactionTime,
        recordedVideos,
        setBestReactionTime,
        setCurrentReactionTime,
        setRecordedVideosContext,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};