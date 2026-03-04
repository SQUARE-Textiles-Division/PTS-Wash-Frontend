import { createContext, useContext, useEffect, useState } from "react";
import { getData } from "./components/genericApiService";
import { ip } from "./ip";

const MachineContext = createContext<number[]>([]);

type MachineProviderProps = { children: React.ReactNode };

interface Machine {
  machine_number: number;
  SAP: string;
  added_at: string;
}

export const MachineProvider = ({ children }: MachineProviderProps) => {
  const [machines, setMachines] = useState<number[]>([]);

  useEffect(() => {
    // ✅ Wrap API in try/catch
    try {
      getData<Machine[]>(
        `wet-process/machines`,
        ip,
        {},
        {},
        (res: Machine[] = []) => {
          if (!Array.isArray(res)) {
            console.warn("Machine API returned invalid data:", res);
            return;
          }
          console.log("Fetched machines:", res);
          setMachines(res.map(m => m.machine_number));
        }
      );
    } catch (err) {
      console.error("MachineProvider getData error:", err);
    }
  }, []);

  return (
    <MachineContext.Provider value={machines}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachines = () => useContext(MachineContext);