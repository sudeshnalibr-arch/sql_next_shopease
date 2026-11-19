import api from "@/lib/axiosInstance";

import type {
  StaffInventoryItem,
  StaffInventoryResponse,
} from "./inventory.types";

export const getStaffInventory =
  async (): Promise<StaffInventoryItem[]> => {
    const response = await api.get<StaffInventoryResponse>(
      "/staff/inventory"
    );

    return response.data.data;
  };