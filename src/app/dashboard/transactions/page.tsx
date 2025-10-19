"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { Transaction } from "@/types/Transaction";
import { TransactionsService } from "@/services/TransactionsService";

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await TransactionsService.getAll();
        if (isMounted) setTransactions(data);
      } catch (error) {
        console.error("Erro ao buscar transações", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns: GridColDef<Transaction>[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "fromUser", headerName: "De", flex: 1, valueGetter: (params: any) => params.row.fromUser?.name || "—" },
    { field: "toUser", headerName: "Para", flex: 1, valueGetter: (params: any) => params.row.toUser?.name || "—" },
    { field: "amount", headerName: "Valor", flex: 0.5 },
    { field: "type", headerName: "Tipo", flex: 0.5 },
    { field: "description", headerName: "Descrição", flex: 1 },
    { field: "createdAt", headerName: "Data", flex: 0.7, valueGetter: (params: any) => new Date(params.row.createdAt).toLocaleString() },
  ];

  return (
    <Box p={3} sx={{ height: "80vh", width: "100%" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Transações</Typography>
      <DataGrid<Transaction>
        rows={transactions}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  );
}
