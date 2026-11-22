// Het Bokkenrijdertje — kalender. Beheer via admin.html (of hier, maar houd het geldige JSON).
// Velden per evenement: date (JJJJ-MM-DD), title, town verplicht; end, time, type (markt|event|bedrijf), place, note, link optioneel.
window.SITE = {
  "show": {
    "agenda": true
  },
  "events": [
    {
      "date": "2026-10-10",
      "type": "event",
      "title": "Kweikersdag",
      "town": "Tienen"
    },
    {
      "date": "2026-11-21",
      "type": "markt",
      "title": "Markt in Tienen",
      "town": "Tienen"
    },
    {
      "date": "2026-11-28",
      "type": "markt",
      "title": "Wintermarkt ‘De Wermste Dries’",
      "town": "Drieslinter"
    }
  ]
};
