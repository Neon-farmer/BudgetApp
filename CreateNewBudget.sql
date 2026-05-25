SET XACT_ABORT ON;
BEGIN TRAN;

BEGIN TRY
    -- === Configuration / parameters ===
    DECLARE @UserId NVARCHAR(450) = N'<userid>'; -- Replace with actual user ID
    DECLARE @TitheEnabled BIT = 1;
    DECLARE @TithePercentage DECIMAL(5,2) = 10.00;
    DECLARE @AutoPlan BIT = 1;
    DECLARE @DefaultEnvelopeName NVARCHAR(200) = N'Default';
    DECLARE @TitheEnvelopeName NVARCHAR(200) = N'Tithe';
    DECLARE @InitialDefaultBalance DECIMAL(18,2) = 0.00;
    DECLARE @ExamplePlanName NVARCHAR(200) = N'Monthly Savings';
    DECLARE @ExamplePlanMonthlyAmount DECIMAL(18,2) = 100.00;
    DECLARE @ExamplePlanStartDate DATETIME = '2026-06-01'; 

    -- Variables to capture created IDs
    DECLARE @BudgetId INT;
    DECLARE @DefaultEnvelopeId INT;
    DECLARE @TitheEnvelopeId INT;
    DECLARE @PlanId INT;

    -- === Insert Budget ===
    -- Use 0 as a temporary placeholder since the column is NOT NULL
    INSERT INTO Budgets (TitheFeatureEnabled, TitheEnvelopeId, TithePercentage, DefaultEnvelopeId, LastPlanApplied, AutoPlan)
    VALUES (@TitheEnabled, 0, @TithePercentage, 0, NULL, @AutoPlan);

    -- Capture identity
    SET @BudgetId = SCOPE_IDENTITY();
    PRINT 'Created budget id = ' + CAST(@BudgetId AS NVARCHAR(20));

    -- === Insert default envelope(s) ===
    INSERT INTO Envelopes (BudgetId, Name, Balance)
    VALUES (@BudgetId, @DefaultEnvelopeName, @InitialDefaultBalance);

    SET @DefaultEnvelopeId = SCOPE_IDENTITY();
    PRINT 'Created default envelope id = ' + CAST(@DefaultEnvelopeId AS NVARCHAR(20));

    -- Optionally create tithe envelope
    INSERT INTO Envelopes (BudgetId, Name, Balance)
    VALUES (@BudgetId, @TitheEnvelopeName, 0.00);

    SET @TitheEnvelopeId = SCOPE_IDENTITY();
    PRINT 'Created tithe envelope id = ' + CAST(@TitheEnvelopeId AS NVARCHAR(20));

    -- === Update budget to replace the dummy 0s with real IDs ===
    UPDATE Budgets
    SET DefaultEnvelopeId = @DefaultEnvelopeId,
        TitheEnvelopeId = @TitheEnvelopeId
    WHERE Id = @BudgetId;

    -- === Optional: Create an example plan ===
    INSERT INTO Plans (BudgetId, Name, EnvelopeId, Priority, MonthlyAmount, StartDate, PlanBalance)
    VALUES (@BudgetId, @ExamplePlanName, @DefaultEnvelopeId, 1, @ExamplePlanMonthlyAmount, @ExamplePlanStartDate, 0.00);

    SET @PlanId = SCOPE_IDENTITY();
    PRINT 'Created plan id = ' + CAST(@PlanId AS NVARCHAR(20));

    -- === Attach budget to a user ===
    IF EXISTS (SELECT 1 FROM Users WHERE Id = @UserId)
    BEGIN
        UPDATE Users SET BudgetId = @BudgetId WHERE Id = @UserId;
        PRINT 'Linked existing user ' + @UserId + ' to budget ' + CAST(@BudgetId AS NVARCHAR(20));
    END
    ELSE IF EXISTS (SELECT 1 FROM AspNetUsers WHERE Id = @UserId)
    BEGIN
        UPDATE AspNetUsers SET BudgetId = @BudgetId WHERE Id = @UserId;
        PRINT 'Linked existing AspNetUsers user ' + @UserId + ' to budget ' + CAST(@BudgetId AS NVARCHAR(20));
    END

    COMMIT TRAN;
    PRINT 'Budget creation transaction committed successfully.';
END TRY
BEGIN CATCH
    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
    DECLARE @ErrNo INT = ERROR_NUMBER();
    ROLLBACK TRAN;
    RAISERROR('Error creating budget and dependencies: %d %s', 16, 1, @ErrNo, @ErrMsg);
END CATCH;