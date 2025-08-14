import { ApiService, ApiResponse } from "./apiService";
import {
  Budget,
  Envelope,
  Plan,
  Transaction,
  CreateEnvelopeRequest,
  UpdateEnvelopeRequest,
  CreateTransactionRequest,
  CreatePlanRequest,
  PlanPrioritiesUpdateDto,
  MonthlyUpdateRequest,
  AllocateIncomeDto,
  UpdateBudgetSettingsDto,
} from "./types";

/**
 * Budget API Service
 * Provides typed methods for all budget-related API operations
 */
export class BudgetApiService {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  // Budget Operations
  async getBudget(): Promise<ApiResponse<Budget>> {
    return this.apiService.get<Budget>("/budget");
  }

  async updateBudgetSettings(settings: UpdateBudgetSettingsDto): Promise<ApiResponse<Budget>> {
    return this.apiService.put<Budget>("/budget/settings", settings);
  }

  // Envelope Operations
  async getEnvelopes(budgetId: number): Promise<ApiResponse<Envelope[]>> {
    return this.apiService.get<Envelope[]>(`/envelope?budgetId=${budgetId}`);
  }

  async getEnvelope(id: number): Promise<ApiResponse<Envelope>> {
    return this.apiService.get<Envelope>(`/envelope/${id}`);
  }

  async createEnvelope(envelope: CreateEnvelopeRequest): Promise<ApiResponse<Envelope>> {
    return this.apiService.post<Envelope>("/envelope", envelope);
  }

  async updateEnvelope(id: number, envelope: UpdateEnvelopeRequest): Promise<ApiResponse<boolean>> {
    // Note: This endpoint only updates the name and returns a boolean, not an Envelope object
    return this.apiService.put<boolean>(`/envelope/${id}`, envelope);
  }

  async deleteEnvelope(id: number): Promise<ApiResponse<boolean>> {
    // Note: This endpoint returns a boolean indicating success
    return this.apiService.delete<boolean>(`/envelope/${id}`);
  }

  // Plan Operations
  async getPlansByBudget(budgetId: number): Promise<ApiResponse<Plan[]>> {
    return this.apiService.get<Plan[]>(`/plan?budgetId=${budgetId}`);
  }

  async getPlan(id: number): Promise<ApiResponse<Plan>> {
    return this.apiService.get<Plan>(`/plan/${id}`);
  }

  async createPlan(plan: CreatePlanRequest): Promise<ApiResponse<Plan>> {
    return this.apiService.post<Plan>("/plan", plan);
  }

  async updatePlan(id: number, plan: Plan): Promise<ApiResponse<Plan>> {
    return this.apiService.put<Plan>(`/plan/${id}`, plan);
  }

  async updatePlanPriorities(dto: PlanPrioritiesUpdateDto): Promise<ApiResponse<Plan[]>> {
    return this.apiService.put<Plan[]>("/plan/priorities", dto);
  }

  async updatePlanBalancesMonthly(request: MonthlyUpdateRequest): Promise<ApiResponse<Plan[]>> {
    return this.apiService.post<Plan[]>("/plan/balances/monthly-update", request);
  }

  async allocateIncome(dto: AllocateIncomeDto): Promise<ApiResponse<Transaction[]>> {
    return this.apiService.post<Transaction[]>("/budget/allocate-income", dto);
  }

  async deletePlan(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/plan/${id}`);
  }

  // Transaction Operations
  async getTransactions(envelopeId?: number): Promise<ApiResponse<Transaction[]>> {
    const query = envelopeId ? `?envelopeId=${envelopeId}` : "";
    return this.apiService.get<Transaction[]>(`/transaction${query}`);
  }

  async getTransaction(id: number): Promise<ApiResponse<Transaction>> {
    return this.apiService.get<Transaction>(`/transaction/${id}`);
  }

  async createTransaction(transaction: CreateTransactionRequest): Promise<ApiResponse<Transaction>> {
    return this.apiService.post<Transaction>("/transaction", transaction);
  }

  async updateTransaction(id: number, transaction: Partial<CreateTransactionRequest>): Promise<ApiResponse<Transaction>> {
    return this.apiService.put<Transaction>(`/transaction/${id}`, transaction);
  }

  async deleteTransaction(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/transaction/${id}`);
  }
}
