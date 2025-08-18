import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PageContainer as Container } from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import { ThemeSelector } from "../components/ThemeSelector";
import { useGlobalLoading } from "../hooks/useGlobalLoading";
import { Loading } from "../components/Loading";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { Button } from "../components/Button";
import { EnvelopeSelector } from "../components/EnvelopeSelector";
import { ActionCard, ActionGrid } from "../components/ActionCard";
import { Budget, UpdateBudgetSettingsDto, Envelope } from "../services/types";

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SettingsInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  width: 100px;
  font: ${props => props.theme.fonts.body};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &.error {
    border-color: ${props => props.theme.colors.error};
    background-color: rgba(255, 0, 0, 0.05);
  }
`;

const ValidationMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.8rem;
  margin-top: 0.25rem;
  text-align: center;
`;

const Toggle = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const SettingsControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
`;

const ControlLabel = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
  flex: 1;
  text-align: left;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success};
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const budgetApiService = useBudgetApi();
  const { showLoading, hideLoading } = useGlobalLoading();
  
  const [budget, setBudget] = useState<Budget | null>(null);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UpdateBudgetSettingsDto>({
    titheFeatureEnabled: false,
    titheEnvelopeId: undefined,
    tithePercentage: 10,
    defaultEnvelopeId: 0,
    autoPlan: false,
  });
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });
  const [validationErrors, setValidationErrors] = useState<{
    tithePercentage?: string;
  }>({});

  // Load budget data
  useEffect(() => {
    const loadBudget = async () => {
      try {
        const response = await budgetApiService.getBudget();
        if (response.data) {
          setBudget(response.data);
          setSettings({
            titheFeatureEnabled: response.data.titheFeatureEnabled,
            titheEnvelopeId: response.data.titheEnvelopeId,
            tithePercentage: response.data.tithePercentage,
            defaultEnvelopeId: response.data.defaultEnvelopeId,
            autoPlan: response.data.autoPlan,
          });
          
          // Load envelopes separately
          const envelopesResponse = await budgetApiService.getEnvelopes(response.data.id);
          if (envelopesResponse.data) {
            setEnvelopes(envelopesResponse.data);
          }
        }
      } catch (error) {
        console.error('Error loading budget:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBudget();
  }, [budgetApiService]);

  // Validation functions
  const validateTithePercentage = (value: number): string | null => {
    if (isNaN(value)) {
      return "Please enter a valid number";
    }
    if (value < 1) {
      return "Percentage must be at least 1%";
    }
    if (value > 100) {
      return "Percentage cannot exceed 100%";
    }
    if (!Number.isInteger(value)) {
      return "Percentage must be a whole number";
    }
    return null;
  };

  const handleTithePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const stringValue = e.target.value;
    
    // Clear validation error when user starts typing
    if (validationErrors.tithePercentage) {
      setValidationErrors(prev => ({ ...prev, tithePercentage: undefined }));
    }
    
    // Allow empty input (user is typing)
    if (stringValue === '') {
      setSettings({ ...settings, tithePercentage: 1 }); // Set to minimum valid value
      return;
    }
    
    const validationError = validateTithePercentage(value);
    if (validationError) {
      setValidationErrors(prev => ({ ...prev, tithePercentage: validationError }));
    }
    
    setSettings({ ...settings, tithePercentage: value || 1 });
  };

  // Navigation handlers
  const handleManageEnvelopes = () => {
    navigate("/budget/envelopes");
  };

  const handleManagePlans = () => {
    navigate("/budget/planner");
  };

  const handleViewTransactions = () => {
    navigate("/budget/transactions");
  };

  const handleSaveSettings = async () => {
    if (!budget) return;

    // Validate tithe percentage before saving
    if (settings.titheFeatureEnabled) {
      const percentageError = validateTithePercentage(settings.tithePercentage);
      if (percentageError) {
        setValidationErrors({ tithePercentage: percentageError });
        setSaveStatus({ type: 'error', message: 'Please fix validation errors before saving' });
        return;
      }
    }

    try {
      showLoading('Saving settings...');
      setSaveStatus({ type: null, message: '' });
      setValidationErrors({}); // Clear any validation errors

      const response = await budgetApiService.updateBudgetSettings(settings);
      
      if (response.data) {
        setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });
        setBudget(response.data);
      } else {
        setSaveStatus({ type: 'error', message: response.message || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({ type: 'error', message: 'An error occurred while saving settings' });
    } finally {
      hideLoading();
    }
  };

  const availableEnvelopes = envelopes;

  if (isLoading) {
    return (
      <Container maxWidth="800px" breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Settings' }
      ]}>
        <Loading />
      </Container>
    );
  }

  if (!budget) {
    return (
      <Container maxWidth="800px" breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Settings' }
      ]}>
        <ErrorMessage>Failed to load budget data</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container maxWidth="800px" breadcrumbs={[
      { label: 'Home', path: '/budget/home' },
      { label: 'Settings' }
    ]}>
      <PageTitle>Budget Settings</PageTitle>
      
      {/* Settings Action Cards */}
      <ActionGrid minCardWidth="280px">
        {/* <ActionCard
          title="Theme"
          description="Choose your preferred color theme for the application."
          variant="settings"
        >
          <SettingsControl>
            <ThemeSelector />
          </SettingsControl>
        </ActionCard> */}

        <ActionCard
          title="Auto-Plan Feature"
          description="Automatically apply planned monthly amounts to plan balances at the start of each month."
          variant="settings"
        >
          <SettingsControl>
            <ControlRow>
              <ControlLabel>Enable Auto-Plan</ControlLabel>
              <Toggle
                checked={settings.autoPlan}
                onChange={(e) => setSettings({ ...settings, autoPlan: e.target.checked })}
              />
            </ControlRow>
          </SettingsControl>
        </ActionCard>

        <ActionCard
          title="Default Envelope"
          description="Set the default envelope for unplanned income."
          variant="settings"
        >
          <SettingsControl>
            <EnvelopeSelector
              envelopes={availableEnvelopes}
              value={settings.defaultEnvelopeId > 0 ? settings.defaultEnvelopeId.toString() : ''}
              onChange={(value) => setSettings({ ...settings, defaultEnvelopeId: parseInt(value) || 0 })}
              placeholder="Select default envelope"
              required
            />
          </SettingsControl>
        </ActionCard>

        <ActionCard
          title="Tithe Feature"
          description="Enable tithing with automatic percentage calculation."
          variant="settings"
        >
          <SettingsControl>
            <ControlRow>
              <ControlLabel>Enable Tithe</ControlLabel>
              <Toggle
                checked={settings.titheFeatureEnabled}
                onChange={(e) => setSettings({ ...settings, titheFeatureEnabled: e.target.checked })}
              />
            </ControlRow>
            {settings.titheFeatureEnabled && (
              <>
                <ControlRow>
                  <ControlLabel>Percentage</ControlLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <SettingsInput
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={settings.tithePercentage}
                      onChange={handleTithePercentageChange}
                      className={validationErrors.tithePercentage ? 'error' : ''}
                      style={{ width: '80px' }}
                    />
                    {validationErrors.tithePercentage && (
                      <ValidationMessage>{validationErrors.tithePercentage}</ValidationMessage>
                    )}
                  </div>
                </ControlRow>
                <ControlRow>
                  <ControlLabel>Envelope</ControlLabel>

                <EnvelopeSelector
                  envelopes={availableEnvelopes}
                  value={settings.titheEnvelopeId ? settings.titheEnvelopeId.toString() : ''}
                  onChange={(value) => setSettings({ 
                    ...settings, 
                    titheEnvelopeId: value ? parseInt(value) : undefined 
                  })}
                  placeholder="Select tithe envelope"
                  />
                  </ControlRow>
              </>
            )}
          </SettingsControl>
        </ActionCard>
      </ActionGrid>
      
      <SettingsContainer>
        {/* Save Button */}
        <SaveButtonContainer>
          <Button 
            color="primary" 
            onClick={handleSaveSettings}
            disabled={
              !settings.defaultEnvelopeId || 
              (settings.titheFeatureEnabled && !settings.titheEnvelopeId) ||
              validationErrors.tithePercentage !== undefined
            }
            tooltip={
              !settings.defaultEnvelopeId 
                ? "Please select a default envelope" 
                : settings.titheFeatureEnabled && !settings.titheEnvelopeId 
                  ? "Please select a tithe envelope when tithe feature is enabled"
                  : validationErrors.tithePercentage
                    ? "Please fix the tithe percentage validation error"
                    : undefined
            }
          >
            Save Settings
          </Button>
        </SaveButtonContainer>

        {/* Status Messages */}
        {saveStatus.type === 'success' && (
          <SuccessMessage>{saveStatus.message}</SuccessMessage>
        )}
        {saveStatus.type === 'error' && (
          <ErrorMessage>{saveStatus.message}</ErrorMessage>
        )}
      </SettingsContainer>
    </Container>
  );
};
