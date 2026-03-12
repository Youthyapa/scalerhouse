function doPost(e) {
  // 1. Open your Google Sheet by its ID (found in the URL: https://docs.google.com/spreadsheets/d/[ID]/edit)
  // Or, since it's attached to the active spreadsheet, we can just get the active one
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // 2. Parse the incoming JSON payload from ScalerHouse
    var data = JSON.parse(e.postData.contents);
    
    // 3. Append the data as a new row in your Sheet
    // Note: Assuming your columns are: Date, Type, Name, Website, WhatsApp, Business Type, Revenue
    sheet.appendRow([
      data.date || new Date().toISOString(),
      data.type || "Growth Audit",
      data.name || "N/A",
      data.website || "N/A",
      data.whatsapp || "N/A",
      data.businessType || "N/A",
      data.revenue || "N/A"
    ]);
    
    // 4. Return success response to the website
    return ContentService.createTextOutput(JSON.stringify({"status": "Success"}))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    // Handle error if JSON parsing fails
    return ContentService.createTextOutput(JSON.stringify({"status": "Error", "message": error.message}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
