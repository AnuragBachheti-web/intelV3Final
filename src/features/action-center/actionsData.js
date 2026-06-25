export const actionStats = [
  { title: "Critical Actions", value: "8", subtitle: "Requires immediate attention", icon: "fa-exclamation-triangle", color: "from-red-400 to-red-500", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" },
  { title: "High Priority", value: "12", subtitle: "Action needed within 24h", icon: "fa-arrow-up", color: "from-orange-400 to-orange-500", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" },
  { title: "In Progress", value: "5", subtitle: "Currently being addressed", icon: "fa-spinner", color: "from-blue-400 to-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
  { title: "Completed Today", value: "18", subtitle: "+22% vs yesterday", icon: "fa-check", color: "from-green-400 to-green-500", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200", trend: "fa-arrow-up" }
];

export const actionDetails = {
  '1': {
    id: '1',
    title: 'Transfer Funds to Operating Account',
    priority: 'CRITICAL',
    priorityColor: 'red',
    actionId: '#ACT-2401',
    due: 'Today',
    category: 'Cash Management',
    status: 'Pending',
    assignee: 'Sarah Johnson',
    description: 'Operating account balance has fallen below the minimum threshold of $50K. Current balance is $42,800, which is $7,200 below target.',
    impact: 'High - Risk of overdraft fees and inability to process payments',
    steps: [
      'Review current savings account balance ($186K available)',
      'Initiate transfer of $10K from savings to operating account',
      'Verify transfer completion within 2 hours',
      'Update cash flow forecast with new balances'
    ],
    relatedActions: ['#ACT-2405 - Review Cash Burn Rate', '#ACT-2407 - Rebalance Account Allocation'],
    timeline: '2 hours overdue'
  },
  '2': {
    id: '2',
    title: 'Process Overdue Vendor Payments',
    priority: 'CRITICAL',
    priorityColor: 'red',
    actionId: '#ACT-2402',
    due: 'Today',
    category: 'Payments',
    status: 'Pending',
    assignee: 'Michael Chen',
    description: '5 vendor payments totaling $38,200 are past their due dates. Late fees of $1,910 will be assessed if not paid within 48 hours.',
    impact: 'High - Late fees, damaged vendor relationships, potential credit impact',
    steps: [
      'Review list of overdue vendors and amounts',
      'Verify available funds in operating account',
      'Process ACH payments for all 5 vendors',
      'Send payment confirmation emails to vendors',
      'Update payment schedule and set reminders'
    ],
    relatedActions: ['#ACT-2401 - Transfer Funds', '#ACT-2404 - Claim Early Payment Discounts'],
    timeline: 'Past due'
  },
  '3': {
    id: '3',
    title: 'Follow Up on Overdue Invoices',
    priority: 'HIGH',
    priorityColor: 'orange',
    actionId: '#ACT-2403',
    due: 'Tomorrow',
    category: 'Collections',
    status: 'Pending',
    assignee: 'Emily Rodriguez',
    description: '8 client invoices totaling $52K are 15+ days past due. Following up could accelerate collections and improve cash position.',
    impact: 'Medium-High - Potential to recover $52K and reduce DSO',
    steps: [
      'Generate list of overdue invoices with client contact info',
      'Prioritize by amount and days overdue',
      'Send friendly reminder emails to all clients',
      'Make phone calls to top 3 largest outstanding amounts',
      'Offer payment plans if needed',
      'Document all communication attempts'
    ],
    relatedActions: ['#ACT-2408 - Update Cash Flow Forecast'],
    timeline: 'Due tomorrow'
  },
  '4': {
    id: '4',
    title: 'Claim Early Payment Discounts',
    priority: 'HIGH',
    priorityColor: 'orange',
    actionId: '#ACT-2404',
    due: 'In 2 days',
    category: 'Payments',
    status: 'Pending',
    assignee: 'Sarah Johnson',
    description: '3 vendors are offering 2% early payment discounts. Paying within 5 days will save $2,400 total.',
    impact: 'Medium - Savings of $2,400 with 14.6% annualized return',
    steps: [
      'Verify discount terms and payment deadlines',
      'Calculate total discount savings ($2,400)',
      'Confirm sufficient funds available',
      'Process early payments to capture discounts',
      'Track and report savings achieved'
    ],
    relatedActions: ['#ACT-2401 - Transfer Funds', '#ACT-2407 - Rebalance Accounts'],
    timeline: 'Discount expires in 5 days'
  },
  '5': {
    id: '5',
    title: 'Review Cash Burn Rate',
    priority: 'HIGH',
    priorityColor: 'orange',
    actionId: '#ACT-2405',
    due: 'In 3 days',
    category: 'Cash Management',
    status: 'Pending',
    assignee: 'Michael Chen',
    description: 'Cash burn rate has increased 42% week-over-week. Current runway is 4.2 months. Need to analyze expenses and develop action plan to reduce expenses.',
    impact: 'High - Impacts long-term sustainability and funding needs',
    steps: [
      'Pull detailed expense report for past 30 days',
      'Identify categories with highest increases',
      'Compare against budget and historical trends',
      'Develop action plan to reduce non-essential expenses',
      'Present findings and recommendations to management',
      'Implement approved cost reduction measures'
    ],
    relatedActions: ['#ACT-2401 - Transfer Funds', '#ACT-2408 - Update Forecast'],
    timeline: 'Due in 3 days'
  },
  '6': {
    id: '6',
    title: 'Verify Unusual Transfer Pattern',
    priority: 'MEDIUM',
    priorityColor: 'yellow',
    actionId: '#ACT-2406',
    due: 'In 5 days',
    category: 'Cash Management',
    status: 'Pending',
    assignee: 'Emily Rodriguez',
    description: 'AI detected 6 large transfers totaling $124K between accounts. Need to verify accuracy and ensure proper documentation.',
    impact: 'Medium - Ensure accuracy of financial records',
    steps: [
      'Review all 6 transfers with dates and amounts',
      'Verify authorization and business purpose',
      'Check for proper documentation and approvals',
      'Confirm transfers completed successfully',
      'Update records if any discrepancies found'
    ],
    relatedActions: ['#ACT-2407 - Rebalance Account Allocation'],
    timeline: 'Due in 5 days'
  },
  '7': {
    id: '7',
    title: 'Rebalance Account Allocation',
    priority: 'MEDIUM',
    priorityColor: 'yellow',
    actionId: '#ACT-2407',
    due: 'Next week',
    category: 'Cash Management',
    status: 'Pending',
    assignee: 'Sarah Johnson',
    description: 'Optimize fund distribution across accounts to maximize interest earnings while maintaining required liquidity buffers.',
    impact: 'Medium - Potential to increase interest income by $400-600/month',
    steps: [
      'Review current balances across all accounts',
      'Calculate minimum required balances for operations',
      'Identify excess funds that can be moved to high-yield savings',
      'Execute transfers to optimize allocation',
      'Set up monthly review process'
    ],
    relatedActions: ['#ACT-2401 - Transfer Funds', '#ACT-2404 - Early Payments'],
    timeline: 'Due next week'
  },
  '8': {
    id: '8',
    title: 'Update Cash Flow Forecast',
    priority: 'MEDIUM',
    priorityColor: 'yellow',
    actionId: '#ACT-2408',
    due: 'Next week',
    category: 'Forecasting',
    status: 'Pending',
    assignee: 'Michael Chen',
    description: 'Quarterly forecast refresh needed with latest transaction data, upcoming obligations, and revised revenue projections.',
    impact: 'Medium - Ensures accurate planning and decision making',
    steps: [
      'Gather latest transaction data from all accounts',
      'Update revenue projections based on pipeline',
      'Review and update expense forecasts',
      'Incorporate known upcoming obligations',
      'Run scenario analysis for best/worst case',
      'Present updated forecast to leadership'
    ],
    relatedActions: ['#ACT-2403 - Collections Follow-up', '#ACT-2405 - Burn Rate Review'],
    timeline: 'Due next week'
  }
};

export const actionItems = Object.values(actionDetails);
