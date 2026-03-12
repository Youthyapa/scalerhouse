function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    // 1. Append the data as a new row in your Sheet
    sheet.appendRow([
      data.date || new Date().toISOString(),
      data.type || "Growth Audit",
      data.name || "N/A",
      data.website || "N/A",
      data.whatsapp || "N/A",
      data.businessType || "N/A",
      data.revenue || "N/A"
    ]);

    // 2. Send WhatsApp Notification via CallMeBot (Free API)
    // IMPORTANT: Get your API key by sending a WhatsApp message to +34 621 331 709 with the text: "I allow callmebot to send me messages"
    var phone = "+919876543210"; // Replace with YOUR mobile number (include country code, e.g., +91...)
    var apikey = "123456"; // Replace with the API key the bot sends you

    var message = "🚀 *New ScalerHouse Lead!* 🚀%0A" + 
                  "Name: " + (data.name || "N/A") + "%0A" + 
                  "Website: " + (data.website || "N/A") + "%0A" + 
                  "WhatsApp: " + (data.whatsapp || "N/A") + "%0A" + 
                  "Industry: " + (data.businessType || "N/A") + "%0A" + 
                  "Revenue: " + (data.revenue || "N/A");

    var whatsappUrl = "https://api.callmebot.com/whatsapp.php?phone=" + phone + "&text=" + message + "&apikey=" + apikey;
    
    // Hit the CallMeBot API to trigger the WhatsApp message
    try {
      UrlFetchApp.fetch(whatsappUrl);
    } catch(waErr) {
      console.log("WhatsApp Error: ", waErr.message);
    }
    
    // 3. Return success response to the website
    return ContentService.createTextOutput(JSON.stringify({"status": "Success"}))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "Error", "message": error.message}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
