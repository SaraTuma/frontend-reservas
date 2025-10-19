"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TransactionsService } from "@/services/TransactionsService";
import { UserService } from "@/services/UserService";

interface TransactionBackend {
  id: number;
  fromUserId: number;
  toUserId: number;
  amount: string;
  type: string;
  description: string;
  createdAt: string;
}

interface TransactionWithUsers extends TransactionBackend {
  fromUserName: string;
  toUserName: string;
  amountNumber: number;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<TransactionWithUsers[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTransaction, setSelectedTransaction] = React.useState<TransactionWithUsers | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await TransactionsService.getAll();
        const data: TransactionBackend[] = response;
        console.log("Transações recebidas do backend:", data);
        const enriched: TransactionWithUsers[] = await Promise.all(
          data.map(async (tx) => {
            const fromUserResp = await UserService.getById(tx.fromUserId);
            const toUserResp = await UserService.getById(tx.toUserId);

            return {
              ...tx,
              fromUserName: fromUserResp?.data?.name ?? "—",
              toUserName: toUserResp?.data?.name ?? "—",
              amountNumber: Number(tx.amount),
            };
          })
        );

        if (isMounted) setTransactions(enriched);
      } catch (error) {
        console.error("Erro ao buscar transações", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTransactions();
    return () => { isMounted = false; };
  }, []);

  const handleView = (transaction: TransactionWithUsers) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const allColumns: GridColDef<TransactionWithUsers>[] = [
    { field: "id", headerName: "ID", flex: 0.3, minWidth: 50 },
    { field: "fromUserName", headerName: "De", flex: 1, minWidth: 150 },
    { field: "toUserName", headerName: "Para", flex: 1, minWidth: 150 },
    { 
      field: "amountNumber", 
      headerName: "Valor", 
      flex: 0.5, 
      minWidth: 100,
      valueGetter: (params: any) => `Kz ${(params.row.amountNumber || 0).toFixed(2)}` 
    },
    { field: "type", headerName: "Tipo", flex: 0.5, minWidth: 120 },
    { 
      field: "createdAt", 
      headerName: "Data", 
      flex: 0.7, 
      minWidth: 150,
      valueGetter: (params: any) => params.row.createdAt ? new Date(params.row.createdAt).toLocaleString() : "—"
    },
    {
      field: "actions",
      headerName: "Visualizar",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <IconButton onClick={() => handleView(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const columnsToShow = allColumns.filter((col, index) => {
    const breakpoints = [0, 600, 700, 800, 900, 1000, 1100];
    return windowWidth > (breakpoints[index] ?? 0);
  });

  return (
    <Box p={3} sx={{ width: "100%" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Transações</Typography>
      <DataGrid<TransactionWithUsers>
        rows={transactions}
        columns={columnsToShow}
        loading={loading}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        autoHeight
      />

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes da Transação</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Stack spacing={1}>
              <Typography><strong>ID:</strong> {selectedTransaction.id}</Typography>
              <Divider />
              <Typography><strong>De:</strong> {selectedTransaction.fromUserName}</Typography>
              <Typography><strong>Para:</strong> {selectedTransaction.toUserName}</Typography>
              <Divider />
              <Typography><strong>Valor:</strong> Kz {selectedTransaction.amountNumber.toFixed(2)}</Typography>
              <Typography><strong>Tipo:</strong> {selectedTransaction.type}</Typography>
              <Divider />
              <Typography><strong>Data:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</Typography>
              <Divider />
              <Typography><strong>Descrição:</strong> {selectedTransaction.description}</Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
