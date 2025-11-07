export interface Message {
  id: string;
  content: string;
  sender: "customer" | "bot" | "agent";
  timestamp: Date;
  type: "text" | "action" | "file" | "link";
  metadata?: {
    fileName?: string;
    fileUrl?: string;
    linkUrl?: string;
    actions?: QuickAction[];
    sessionId?: string;
    confidence?: number;
  };
}

export interface QuickAction {
  id: string;
  label: string;
  action:
    | "view_appointments"
    | "view_services"
    | "request_service"
    | "update_profile"
    | "contact_support"
    | "book_appointment"
    | "contact_details"
    | "custom";
  customAction?: string;
  icon?: string;
}

export interface BotResponse {
  message: string;
  suggestions?: string[];
  quickActions?: QuickAction[];
  contextData?: {
    customerName?: string;
    projectId?: string;
    serviceId?: string;
  };
}

export interface ChatSession {
  id: string;
  customerId: string;
  startTime: Date;
  endTime?: Date;
  status: "active" | "ended" | "escalated";
  agentId?: string;
  estimatedWaitTime?: number;
  messages: Message[];
}

export interface CustomerContext {
  id: string;
  name: string;
  currentProject?: {
    id: string;
    name: string;
    status: string;
  };
  currentService?: {
    id: string;
    name: string;
    status: string;
  };
  onlineStatus: "online" | "offline";
}

export interface ChatFeedback {
  sessionId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  timestamp: Date;
  categories?: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "services" | "pricing" | "appointments" | "profile" | "general";
  keywords: string[];
}

export interface FileUpload {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}
