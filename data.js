/*
 * Het Bokkenrijdertje — inhoud
 * ---------------------------------------------------------------
 * Pas hier de agenda en de blog aan. Meer hoef je niet te doen.
 *
 * AGENDA
 *   date   : 'JJJJ-MM-DD' (verplicht). Voorbije data verdwijnen automatisch.
 *   end    : optioneel, laatste dag bij meerdaagse evenementen
 *   time   : bv. '10:00 – 17:00'
 *   type   : 'markt' | 'event' | 'bedrijf'
 *   title, town : verplicht — place, time, note, link : optioneel
 *   link   : optionele URL voor "Meer info"
 */
window.EVENTS = [
  { date: '2026-10-10', type: 'event', title: 'Kweikersdag', town: 'Tienen' },
  { date: '2026-11-21', type: 'markt', title: 'Markt in Tienen', town: 'Tienen' }, // TODO: echte naam van dit evenement?
  { date: '2026-11-28', type: 'markt', title: 'Wintermarkt ‘De Wermste Dries’', town: 'Drieslinter' },
];

/*
 * BLOG
 *   slug   : korte naam voor in de URL (enkel kleine letters en streepjes)
 *   body   : gewone HTML (<p>, <h2>, <ul>, <blockquote>, …)
 *
 * ⚠️ Deze posts zijn VOORBEELDTEKSTEN in Ferre's toon — herschrijf ze gerust.
 */
window.POSTS = [
  {
    slug: 'waarom-koppig',
    title: 'Waarom mijn bokkenpootjes koppig zijn',
    date: '2026-09-28',
    tag: 'In de bakkerij',
    cover: 'img/pootje.webp',
    excerpt: 'Een bokkenpootje laat zich niet haasten. Ik heb het geprobeerd. Het bokkenpootje won.',
    body: `
      <p>Een bokkenpootje laat zich niet haasten. Ik heb het geprobeerd. Het bokkenpootje won.</p>
      <p>Het begint met de schuimkoekjes. Die moeten traag drogen in de oven, op een temperatuur waar een gewone koek van in slaap valt. Wie de oven hoger zet, krijgt koekjes die er van buiten perfect uitzien en van binnen nog aan het nadenken zijn.</p>
      <h2>Dan de crème</h2>
      <p>Boter, suiker, een beetje geheim. De crème moet smeuïg zijn, maar niet zo smeuïg dat ze bij de eerste beet langs je mouw naar buiten ontsnapt. Dat evenwicht zoeken duurt. Mijn huisgenoten hebben veel mislukte versies mogen opeten. Ze klagen niet.</p>
      <h2>En als laatste: de chocolade</h2>
      <p>Elk pootje gaat met de hand in de chocolade. Eén voor één. Ja, dat duurt lang. Nee, ik ga dat niet automatiseren. Daar zit nu net de liefde in.</p>
      <blockquote>Koppig zijn is geen fout. Het is een receptuur.</blockquote>
      <p>Dus als je op de markt staat te wachten terwijl ik nog een zakje vul: dat is de koppigheid. Ze is het waard.</p>`,
  },
  {
    slug: 'de-bokmobiel',
    title: 'De bokmobiel: een bakfiets met karakter',
    date: '2026-09-14',
    tag: 'Achter de schermen',
    cover: 'img/bokkenbak.webp',
    excerpt: 'Hoe ik een bakfiets ombouwde tot rijdende koekjeswinkel, en waarom bergop rijden een sport is.',
    body: `
      <p>Toen ik besloot om bokkenpootjes te verkopen, had ik één probleem: ik kan niet zo goed autorijden. Fietsen eigenlijk ook niet, maar dat leek me een kleiner probleem.</p>
      <p>Zo kwam de bokmobiel er. Een bakfiets met een kast erop, een luifel, een bord met <em>Hier te koop</em> en ons geitje in het midden. Duurzaam, charmant en — zo bleek al snel — verrassend zwaar bergop.</p>
      <h2>Wat er allemaal in past</h2>
      <ul>
        <li>Een paar honderd bokkenpootjes, netjes in dozen</li>
        <li>Een tafeltje en het geruite tafelkleed (onmisbaar)</li>
        <li>Een krijtbord met de prijzen</li>
        <li>Mijn gele tuinbroek (aan mijn lijf, niet in de bak)</li>
      </ul>
      <p>Zie je de bokmobiel ergens staan? Kom gerust goeiendag zeggen. Ook als je geen honger hebt. Al heb je die meestal wel, na het zien van de toonbank.</p>`,
  },
  {
    slug: 'brokkenpiloot',
    title: 'Bokkenpoot zit in brokkenpiloot (en andere wetenswaardigheden)',
    date: '2026-08-30',
    tag: 'Weetjes',
    cover: 'img/zakje.webp',
    excerpt: 'Alles wat je nooit wilde weten over bokkenpootjes, maar toch fijn is om op een feestje te vertellen.',
    body: `
      <p>Een kleine verzameling weetjes, voor wie op het volgende familiefeest iets interessants wil zeggen tussen de koffie en de taart.</p>
      <h2>1. Bokkenpoot zit in brokkenpiloot</h2>
      <p>Alle letters van <em>bokkenpoot</em> zitten, in de juiste volgorde, in het woord <em>brokkenpiloot</em>. Toeval? Gezien mijn rijkunsten met de bakfiets: ik denk het niet.</p>
      <h2>2. De naam</h2>
      <p>Bokkenpootjes danken hun naam aan hun vorm: met het chocoladen uiteinde lijken ze op het pootje van een bok. Het geitje in ons logo is dus geen toeval. Het is familie.</p>
      <h2>3. Supermarkt versus ambacht</h2>
      <p>In de supermarkt vind je er twaalf voor anderhalve euro. Ik vraag een euro per stuk. Proef het verschil en oordeel zelf — ik ben gerust.</p>`,
  },
];
