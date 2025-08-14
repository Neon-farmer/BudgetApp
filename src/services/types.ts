// Budget API Types
export interface Budget {
  id: number;
  titheFeatureEnabled: boolean;
  titheEnvelopeId?: number;
  titheEnvelope?: Envelope;
  tithePercentage: number;
  defaultEnvelopeId: number;
  defaultEnvelope?: Envelope;
  lastPlanApplied?: string; // DateTime from C# becomes string in TypeScript
  autoPlan: boolean;
  plans: Plan[];
  envelopes: Envelope[];
  transactions: Transaction[];
}

export interface Envelope {
  id: number;
  budgetId: number;
  name: string;
  balance: number;
  isSystemEnvelope: boolean;
}

export interface Plan {
  id: number;
  budgetId: number;
  envelopeId: number;
  priority: number;
  monthlyAmount: number;
  planBalance: number;
  startDate: string;
}

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  notes: string;
  envelopeId: number;
}

// API Request/Response Types
export interface CreateEnvelopeRequest {
  EnvelopeName: string;      // ← Matches C# API
  BudgetId: number;          // ← Matches C# API
  EnvelopeBalance?: number;  // ← Matches C# API
}

export interface UpdateEnvelopeRequest {
  EnvelopeName?: string;     // ← Only name can be updated via PUT
  // Note: EnvelopeBalance is not updateable via this endpoint
  // Note: BudgetId is not updateable via this endpoint
}

export interface CreateTransactionRequest {
  Amount: number;
  Notes: string;
  EnvelopeId: number;
  BudgetId: number;
  Date?: string;
}

export interface CreatePlanRequest {
  monthlyAmount: number;
  startDate: string;
  envelopeId: number;
  budgetId: number;
  priority?: number;
}

export interface PlanPriorityItem {
    id: number;      
    priority: number;
}

export interface PlanPrioritiesUpdateDto {
    planPriorities: PlanPriorityItem[];
}

export interface MonthlyUpdateRequest {
    increase: boolean;
}

export interface AllocateIncomeDto {
    Amount: number;
    Notes: string;
    Date: string;
}

export interface UpdateBudgetSettingsDto {
    titheFeatureEnabled: boolean;
    titheEnvelopeId?: number;
    tithePercentage: number;
    defaultEnvelopeId: number;
    autoPlan: boolean;
}
