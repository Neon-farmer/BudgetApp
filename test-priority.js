// Test script to verify priority calculation logic
function testPriorityLogic() {
  console.log("Testing priority calculation logic...");
  
  // Test case 1: No existing plans
  const existingPlans1 = [];
  const getNextPriority1 = () => {
    if (existingPlans1.length === 0) {
      return 1; // First plan gets priority 1
    }
    const maxPriority = Math.max(...existingPlans1.map(plan => plan.priority));
    return maxPriority + 1;
  };
  console.log("Test 1 - No existing plans:", getNextPriority1()); // Should be 1
  
  // Test case 2: Existing plans with priorities 1, 2, 3
  const existingPlans2 = [
    { id: 1, priority: 1 },
    { id: 2, priority: 2 },
    { id: 3, priority: 3 }
  ];
  const getNextPriority2 = () => {
    if (existingPlans2.length === 0) {
      return 1;
    }
    const maxPriority = Math.max(...existingPlans2.map(plan => plan.priority));
    return maxPriority + 1;
  };
  console.log("Test 2 - Existing plans [1,2,3]:", getNextPriority2()); // Should be 4
  
  // Test case 3: Existing plans with mixed priorities
  const existingPlans3 = [
    { id: 1, priority: 5 },
    { id: 2, priority: 1 },
    { id: 3, priority: 3 }
  ];
  const getNextPriority3 = () => {
    if (existingPlans3.length === 0) {
      return 1;
    }
    const maxPriority = Math.max(...existingPlans3.map(plan => plan.priority));
    return maxPriority + 1;
  };
  console.log("Test 3 - Existing plans [5,1,3]:", getNextPriority3()); // Should be 6
}

testPriorityLogic();
