import { createContext, ReactNode, useEffect, useState } from "react";
import { Column } from "@/app/dashboard/types/table-props";

export const TableColumnsContext = createContext<
  TableColumnsContext | undefined
>(undefined);

type TableColumnsContext = {
  columns: Column[];
  shownColumns: Column[];
  setColumns: (cols: Column[]) => void;
};

export function TableColumnsProvider({
  children,
  storageName,
  initialData,
}: {
  children: ReactNode;
  storageName: string;
  initialData: Column[];
}) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [shownColumns, setShownColumns] = useState<Column[]>([]);

  const readColumns = () => {
    const json = window.localStorage.getItem(storageName);
    return json ? (JSON.parse(json) as Column[]) : null;
  };

  const writeColumns = (newColumns: Column[]) => {
    window.localStorage.setItem(storageName, JSON.stringify(newColumns));

    setColumns(newColumns);
    setShownColumns(newColumns.filter((column) => column.shown));
  };

  useEffect(() => {
    const cols = readColumns() ?? initialData;

    setColumns(cols);
    setShownColumns(cols.filter((column) => column.shown));
  }, []);

  return (
    <TableColumnsContext.Provider
      value={{
        columns,
        shownColumns,
        setColumns: writeColumns,
      }}
    >
      {children}
    </TableColumnsContext.Provider>
  );
}
