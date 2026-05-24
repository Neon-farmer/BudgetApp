SET XACT_ABORT ON;
BEGIN TRAN;

BEGIN TRY
    -- === Configuration / parameters ===
    -- Replace @UserId with the application's user id to attach the budget to (if needed).
    DECLARE @UserId NVARCHAR(450) = N'<PUT_USER_ID_HERE>'; -- e.g. AspNetUsers.Id
    DECLARE @TitheEnabled BIT = 0;
    DECLARE @TithePercentage DECIMAL(5,2) = 10.00;
    DECLARE @AutoPlan BIT = 1;
    DECLARE @DefaultEnvelopeName NVARCHAR(200) = N'Default';
    DECLARE @TitheEnvelopeName NVARCHAR(200) = N'Tithe';
    DECLARE @InitialDefaultBalance DECIMAL(18,2) = 0.00;
    DECLARE @ExamplePlanName NVARCHAR(200) = N'Monthly Savings';
    DECLARE @ExamplePlanMonthlyAmount DECIMAL(18,2) = 100.00;
    DECLARE @ExamplePlanStartDate DATETIME = '2026-06-01'; -- adjust as required

    -- Variables to capture created IDs
    DECLARE @BudgetId INT;
    DECLARE @DefaultEnvelopeId INT;
    DECLARE @TitheEnvelopeId INT;
    DECLARE @PlanId INT;

    -- === Insert Budget ===
    -- IMPORTANT: adjust column names to match your Budgets table if they differ.
    INSERT INTO Budgets (TitheFeatureEnabled, TitheEnvelopeId, TithePercentage, DefaultEnvelopeId, LastPlanApplied, AutoPlan)
    VALUES (@TitheEnabled, NULL, @TithePercentage, NULL, NULL, @AutoPlan);

    -- Capture identity
    SET @BudgetId = SCOPE_IDENTITY();

    PRINT 'Created budget id = ' + CAST(@BudgetId AS NVARCHAR(20));

    -- === Insert default envelope(s) ===
    -- Insert a Default envelope that will be used as the budget's default envelope
    INSERT INTO Envelopes (BudgetId, Name, Balance, IsSystemEnvelope)
    VALUES (@BudgetId, @DefaultEnvelopeName, @InitialDefaultBalance, 0);

    SET @DefaultEnvelopeId = SCOPE_IDENTITY();
    PRINT 'Created default envelope id = ' + CAST(@DefaultEnvelopeId AS NVARCHAR(20));

    -- Optionally create tithe envelope if tithe feature might be used
    INSERT INTO Envelopes (BudgetId, Name, Balance, IsSystemEnvelope)
    VALUES (@BudgetId, @TitheEnvelopeName, 0.00, 0);

    SET @TitheEnvelopeId = SCOPE_IDENTITY();
    PRINT 'Created tithe envelope id = ' + CAST(@TitheEnvelopeId AS NVARCHAR(20));

    -- === Update budget to point to created envelope ids ===
    UPDATE Budgets
    SET DefaultEnvelopeId = @DefaultEnvelopeId,
        TitheEnvelopeId = @TitheEnvelopeId
    WHERE Id = @BudgetId;

    -- === Optional: Create an example plan linked to the default envelope ===
    INSERT INTO Plans (BudgetId, Name, EnvelopeId, Priority, MonthlyAmount, StartDate, PlanBalance)
    VALUES (@BudgetId, @ExamplePlanName, @DefaultEnvelopeId, 1, @ExamplePlanMonthlyAmount, @ExamplePlanStartDate, 0.00);

    SET @PlanId = SCOPE_IDENTITY();
    PRINT 'Created plan id = ' + CAST(@PlanId AS NVARCHAR(20));

    -- === Optional: Add an initial transaction (example) ===
    -- If you want an initial transaction (income/deposit), create one referencing the envelope
    -- Example: initial deposit 0.00 (skip if not needed)
    -- INSERT INTO Transactions (Date, Amount, Notes, EnvelopeId, BudgetId)
    -- VALUES (GETDATE(), 0.00, N'Initial setup', @DefaultEnvelopeId, @BudgetId);

    -- === Attach budget to a user (if your Users table has BudgetId foreign key) ===
    -- NOTE: adjust Users / AspNetUsers table and column names as required.
    IF EXISTS (SELECT 1 FROM Users WHERE Id = @UserId)
    BEGIN
        UPDATE Users
        SET BudgetId = @BudgetId
        WHERE Id = @UserId;

        PRINT 'Linked existing user ' + @UserId + ' to budget ' + CAST(@BudgetId AS NVARCHAR(20));
    END
    ELSE IF EXISTS (SELECT 1 FROM AspNetUsers WHERE Id = @UserId)
    BEGIN
        -- If you are using Identity table name AspNetUsers
        UPDATE AspNetUsers
        SET BudgetId = @BudgetId
        WHERE Id = @UserId;

        PRINT 'Linked existing AspNetUsers user ' + @UserId + ' to budget ' + CAST(@BudgetId AS NVARCHAR(20));
    END
    ELSE
    BEGIN
        PRINT 'User id not found in Users or AspNetUsers; skipping linking user.';
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