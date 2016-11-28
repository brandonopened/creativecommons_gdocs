/**
 * @OnlyCurrentDoc
 *
 * limit the scope of file access for this add-on
 */


// Constants START
var ADDON_TITLE = "Creative Commons License Chooser";

var LICENSES = [
  {
    id: "Attribution",
    name: "Attribution 4.0 International",
    href: "http://creativecommons.org/licenses/by/4.0/",
    icon: "https://i.creativecommons.org/l/by/4.0/88x31.png"
  },
  {
    id: "Attribution-ShareAlike",
    name: "Attribution-ShareAlike 4.0 International",
    href: "http://creativecommons.org/licenses/by-sa/4.0/",
    icon: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
  },
  {
    id: "Attribution-NoDerivs",
    name: "Attribution-NoDerivatives 4.0 International",
    href: "http://creativecommons.org/licenses/by-nd/4.0/",
    icon: "https://i.creativecommons.org/l/by-nd/4.0/88x31.png"
  },
  {
    id: "Attribution-NonCommercial",
    name: "Attribution-NonCommercial 4.0 International",
    href: "http://creativecommons.org/licenses/by-nc/4.0/",
    icon: "https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
  },
  {
    id: "Attribution-NonCommercial-ShareAlike",
    name: "Attribution-NonCommercial-ShareAlike 4.0 International",
    href: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
    icon: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
  },
  {
    id: "Attribution-NonCommercial-NoDerivs",
    name: "Attribution-NonCommercial-NoDerivatives 4.0 International",
    href: "http://creativecommons.org/licenses/by-nc-nd/4.0/",
    icon: "https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
  }
];
// Constants END


// Creates a menu entry in the Google Docs UI when the document is opened.
function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

// Runs when the add-on is installed.
function onInstall(e) {
  onOpen(e);
}

// Opens a sidebar
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle(ADDON_TITLE);
  DocumentApp.getUi().showSidebar(ui);
}

// Gets the stored user preferences for adaptations and commercial uses if they exist.
function getPreferences() {
  var userProperties = PropertiesService.getUserProperties();
  var licensePrefs = {
    derivatives: userProperties.getProperty('derivatives'),
    commercial: userProperties.getProperty('commercial')
  };
  return licensePrefs;
}

// Calculates user-selected license and icon
function getSelectedLicense(derivatives, commercial) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('derivatives', derivatives);
  userProperties.setProperty('commercial', commercial);

  var licenseId;
  if (derivatives == "y" && commercial == "y") {
    licenseId = "Attribution";
  } else if (derivatives == "sa" && commercial == "y") {
    licenseId = "Attribution-ShareAlike";
  } else if (derivatives == "n" && commercial == "y") {
    licenseId = "Attribution-NoDerivs";
  } else if (derivatives == "y" && commercial == "n") {
    licenseId = "Attribution-NonCommercial";
  } else if (derivatives == "sa" && commercial == "n") {
    licenseId = "Attribution-NonCommercial-ShareAlike";
  } else if (derivatives == "n" && commercial == "n") {
    licenseId = "Attribution-NonCommercial-NoDerivs"; 
  }

  var license;
  for (var i=0; i<LICENSES.length; i++) {
    var l = LICENSES[i];
    if (licenseId === l.id) {
      license = LICENSES[i];
      break;
    }
  }

  return license;
}

// Inserts icon at the current cursor location.
function insertIcon(name, href, icon) {
  newText = name;
  
  var cursor = DocumentApp.getActiveDocument().getCursor();
  
  if (cursor) {
    var image = UrlFetchApp.fetch(icon).getBlob();
    
    cursor.insertText(" License.");
    var link = cursor.insertText(name);
    link.setLinkUrl(href);
    cursor.insertText("This work is licensed under a Creative Commons ");
    var inlineImage = cursor.insertInlineImage(image);
    inlineImage.setLinkUrl(href);
  } else {
    throw "Place cursor at desired location."; 
  }
}
