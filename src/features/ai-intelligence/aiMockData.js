export const aiMockResult = {
  id: "res_001",
  query: "Analyze my sales performance and suggest improvements",
  status: "success",
  summary: "Your sales have increased by 12.4% over the last 30 days, driven primarily by a surge in the 'Electronics' category. However, average order value (AOV) has slightly declined due to a higher frequency of entry-level item purchases.",
  insights: [
    {
      title: "Category Performance",
      description: "Electronics and Home Appliances are leading current revenue growth.",
      value: "+24.5%",
      type: "positive"
    },
    {
      title: "Average Order Value",
      description: "AOV is down $5.20 compared to the previous month. Consider cross-selling strategies.",
      value: "-3.2%",
      type: "warning"
    },
    {
      title: "Repeat Customer Rate",
      description: "Loyalty programs are showing promise with a 5% increase in repeat users.",
      value: "+5.0%",
      type: "positive"
    }
  ],
  recommendations: [
    {
      action: "Bundle Top Sellers",
      benefit: "Expected AOV increase of 10-15%",
      description: "Create a bundle of 'PowerBank X' and 'Type-C Cable Pro' to capture high-margin accessories at checkout."
    },
    {
      action: "Email Retargeting",
      benefit: "Estimated conversion boost of 8%",
      description: "Launch a win-back campaign for users who haven't purchased in the last 60 days but showed high activity."
    }
  ],
  charts: [
    {
      name: "Conversion Funnel",
      data: [
        { stage: "View", count: 12000 },
        { stage: "Add to Cart", count: 4500 },
        { stage: "Checkout", count: 1800 },
        { stage: "Purchased", count: 1100 }
      ]
    }
  ]
};
