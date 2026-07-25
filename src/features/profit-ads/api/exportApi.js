/**
 * Dummy API to simulate exporting a CSV file.
 * Replace the contents of this function with the actual API call when ready.
 */
export const downloadProfitAdsReport = async (_filters = {}) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Dummy CSV content
  const csvContent = "SKU,ACOS,BREAK_EVEN,CMAA,RECOVERABLE\nSKU-B0BHSZQG3P,41%,17%,340508,158192\nSKU-B0DF1ALTZ,38%,16%,155000,58881";
  
  // Create a Blob from the CSV String
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger the click
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `profit_ads_export_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};
