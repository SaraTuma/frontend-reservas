import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

interface Props {
  services: any[];
  loading: boolean;
  onEdit: (service: any) => void;
  onDelete: (id: number) => void;
}

export default function ServiceTable({ services, loading, onEdit, onDelete }: Props) {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "price", headerName: "Preço", flex: 0.5 },
    { field: "description", headerName: "Descrição", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => onEdit(params.row)}>
            <EditRoundedIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(params.row.id)}>
            <DeleteRoundedIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={services}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
      />
    </div>
  );
}
