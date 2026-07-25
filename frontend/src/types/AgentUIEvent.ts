export type AgentUIEventType =
  | "AGENT_STARTED"
  | "SEARCH_MENU"
  | "MENU_RESULTS"
  | "SELECT_DISH"
  | "CHECK_INVENTORY"
  | "INVENTORY_RESULT"
  | "REPLAN"
  | "GENERATE_DCT"
  | "DCT_GENERATED"
  | "VALIDATE_DCT"
  | "DCT_VALID"
  | "CREATE_ORDER"
  | "ORDER_CREATED"
  | "AGENT_COMPLETED"
  | "AGENT_FAILED";

export interface AgentUIEvent {
  runId: string;
  type: AgentUIEventType;
  timestamp: number;
  goal?: string;
  query?: string;
  count?: number;
  dishId?: string;
  dishName?: string;
  price?: number;
  available?: boolean;
  reasonCode?: string;
  dctTokenId?: string;
  orderId?: string;
  imageUrl?: string;
  dietary?: string[];
}
