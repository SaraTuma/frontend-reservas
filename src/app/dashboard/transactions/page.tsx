"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TransactionsService } from "@/services/TransactionsService";

interface Transaction {
  id: number;
  fromUserId: number;
  toUserId: number;
  amount: string | number;
  type: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchTransactions();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await TransactionsService.getAll();

      // ✅ mantém os valores exatamente como vêm da API
      const parsed = response.map((tx: any) => ({ ...tx }));

      if (mountedRef.current) {
        setTransactions(parsed);
      }
    } catch (error: any) {
      console.error("Erro ao buscar transações", error);
      if (mountedRef.current) {
        setErrorMessage(
          error.response?.status === 404
            ? "Nenhuma transação encontrada."
            : "Erro ao buscar transações."
        );
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDialog = () => {
    setSelectedTransaction(null);
  };

  const formatDate = (value?: string) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  const allColumns: GridColDef<Transaction>[] = [
    { field: "id", headerName: "ID", flex: 0.3, minWidth: 50 },
    {
      field: "fromUserId",
      headerName: "De (Usuário)",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "toUserId",
      headerName: "Para (Usuário)",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "amount",
      headerName: "Valor",
      flex: 0.6,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<Transaction>) => (
        <>{params.value}</>
      ),
    },
    { field: "type", headerName: "Tipo", flex: 0.5, minWidth: 120 },
    {
      field: "createdAt",
      headerName: "Data",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<Transaction>) => (
        <>{formatDate(params.value as string)}</>
      ),
    },
    {
      field: "actions",
      headerName: "Visualizar",
      flex: 0.4,
      minWidth: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Transaction>) => (
        <IconButton onClick={() => handleView(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p={3} sx={{ width: "100%" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Histórico de transações
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={transactions}
          columns={allColumns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          localeText={{
            noRowsLabel: "Nenhuma transação encontrada",
          }}
        />
      )}

      {/* Modal de detalhes */}
      <Dialog
        open={!!selectedTransaction}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalhes da Transação</DialogTitle>
        <DialogContent dividers>
          {selectedTransaction && (
            <Grid container spacing={2}>
              <div>
                <Typography fontWeight="bold">ID:</Typography>
                <Typography>{selectedTransaction.id}</Typography>
              </div>

              <div>
                <Typography fontWeight="bold">Tipo:</Typography>
                <Typography>{selectedTransaction.type}</Typography>
              </div>

              <div>
                <Typography fontWeight="bold">De (Usuário):</Typography>
                <Typography>{selectedTransaction.fromUserId}</Typography>
              </div>

              <div>
                <Typography fontWeight="bold">Para (Usuário):</Typography>
                <Typography>{selectedTransaction.toUserId}</Typography>
              </div>

              <div>
                <Typography fontWeight="bold">Valor:</Typography>
                <Typography>{selectedTransaction.amount}</Typography>
              </div>

              <div>
                <Typography fontWeight="bold">Data:</Typography>
                <Typography>{formatDate(selectedTransaction.createdAt)}</Typography>
              </div>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert
          severity="error"
          onClose={() => setErrorMessage(null)}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
