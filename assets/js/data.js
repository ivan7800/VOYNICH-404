export const SOURCES = [
  {id:'yale',title:'Beinecke Rare Book & Manuscript Library · MS 408',organization:'Yale University',url:'https://beinecke.library.yale.edu/beinecke/collections/beinecke-cipher-voynich-manuscript',kind:'Fuente institucional'},
  {id:'digital',title:'Digital Collections · Voynich Manuscript',organization:'Yale University',url:'https://collections.library.yale.edu/catalog/2002046',kind:'Digitalización oficial'},
  {id:'dating',title:'Radiocarbon dating of the Voynich MS',organization:'René Zandbergen',url:'https://voynich.nu/extra/carbon.html',kind:'Síntesis técnica'},
  {id:'trans',title:'Transliteration of the Text',organization:'René Zandbergen',url:'https://www.voynich.nu/transcr.html',kind:'Transcripciones y metodología'},
  {id:'study',title:'Singulion Structure and the Voynich Manuscript',organization:'Colin Layfield · Lisa Fagin Davis (2026)',url:'https://doi.org/10.4000/16k0a',kind:'Investigación académica'}
];
export const SECTIONS = [
  {id:'herbal',icon:'✿',title:'Herbario',tag:'Ilustraciones botánicas',description:'Especies dibujadas, muchas de identificación discutida, acompañadas de escritura no descifrada.',status:'Descripción visual',source:'yale'},
  {id:'astro',icon:'☼',title:'Astronomía y astrología',tag:'Diagramas celestes',description:'Ruedas, constelaciones y signos zodiacales que han motivado interpretaciones diversas.',status:'Descripción visual',source:'yale'},
  {id:'balneo',icon:'◌',title:'Baños y figuras humanas',tag:'Ilustraciones balneológicas',description:'Figuras humanas, piscinas, tubos y estructuras cuyo significado sigue siendo incierto.',status:'Descripción visual',source:'yale'},
  {id:'cosmo',icon:'✧',title:'Cosmología',tag:'Diagramas desplegables',description:'Composiciones circulares complejas, incluidas las llamadas rosetas.',status:'Descripción visual',source:'yale'},
  {id:'pharma',icon:'❧',title:'Farmacia',tag:'Raíces y recipientes',description:'Conjuntos de raíces, partes vegetales y recipientes que sugieren un contexto farmacéutico.',status:'Interpretación convencional',source:'yale'},
  {id:'recipes',icon:'⁂',title:'Texto y posibles recetas',tag:'Párrafos con estrellas',description:'Páginas de texto con marcas estrelladas; la etiqueta «recetas» es tradicional, no una traducción.',status:'Interpretación convencional',source:'yale'}
];
export const EVIDENCE = [
  {id:'e1',type:'documentado',title:'Custodia e identificación',desc:'El volumen se conserva en la Biblioteca Beinecke, Yale, con la signatura MS 408.',sources:['yale','digital'],topic:'Historia'},
  {id:'e2',type:'documentado',title:'Datación del soporte',desc:'La datación por radiocarbono del pergamino sitúa su fabricación aproximadamente entre 1404 y 1438. No fecha directamente la escritura.',sources:['dating'],topic:'Materialidad'},
  {id:'e3',type:'documentado',title:'Escritura aún no descifrada',desc:'No existe una interpretación completa del texto que cuente con aceptación académica general.',sources:['yale','trans'],topic:'Lenguaje'},
  {id:'e4',type:'documentado',title:'Seis grupos visuales convencionales',desc:'La biblioteca describe grupos botánicos, astrológicos, balneológicos, cosmológicos, farmacéuticos y texto sin ilustraciones.',sources:['yale'],topic:'Contenido'},
  {id:'e5',type:'documentado',title:'Transliterar no es traducir',desc:'EVA y otros sistemas representan gráficamente signos del manuscrito para poder estudiarlos; no revelan por sí mismos su significado.',sources:['trans'],topic:'Método'},
  {id:'e6',type:'incierto',title:'Autoría y propósito',desc:'No se ha establecido de manera convincente quién lo escribió ni para qué se produjo.',sources:['yale'],topic:'Historia'},
  {id:'e7',type:'incierto',title:'Lengua subyacente',desc:'No está demostrado si el texto representa una lengua natural, un sistema cifrado, un sistema construido u otra cosa.',sources:['yale','trans'],topic:'Lenguaje'},
  {id:'e8',type:'hipotesis',title:'Orden original de los cuadernos',desc:'Layfield y Fagin Davis (2026) proponen que las hojas pudieron disponerse originalmente como unidades separadas y encuadernarse después en otro orden.',sources:['study'],topic:'Codicología'},
  {id:'e9',type:'incierto',title:'Identificación de las plantas',desc:'Gran parte de las ilustraciones botánicas carecen de identificaciones universalmente aceptadas.',sources:['yale'],topic:'Contenido'}
];
export const TIMELINE = [
 {date:'1404–1438',title:'Pergamino fechado',detail:'Intervalo estimado de fabricación del soporte por radiocarbono, no fecha exacta de redacción.',source:'dating'},
 {date:'1912',title:'Adquisición por Wilfrid Voynich',detail:'El anticuario adquiere el manuscrito y lo da a conocer en el mercado moderno.',source:'yale'},
 {date:'1969',title:'Llegada a Yale',detail:'H. P. Kraus dona el manuscrito a la Biblioteca Beinecke.',source:'yale'},
 {date:'2009',title:'Estudio de radiocarbono',detail:'Se analizan muestras del pergamino mediante radiocarbono en la Universidad de Arizona.',source:'dating'},
 {date:'2026',title:'Hipótesis sobre la encuadernación',detail:'Layfield y Fagin Davis plantean una posible estructura original distinta. No supone el descifrado del manuscrito.',source:'study'}
];
export const STATUS = {documentado:{label:'Documentado',detail:'Existe un fundamento histórico o material identificable.'},hipotesis:{label:'Hipótesis',detail:'Propuesta publicada que requiere evaluación y contraste.'},incierto:{label:'No resuelto',detail:'Cuestión sin respuesta demostrada.'}};
