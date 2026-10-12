/** Fichas documentales descriptivas, nunca traducciones ni identificaciones botánicas definitivas. */
export const ATLAS_SOURCES=Object.freeze({
 yale:{title:'Biblioteca Beinecke, Yale · MS 408',url:'https://beinecke.library.yale.edu/beinecke/collections/beinecke-cipher-voynich-manuscript'},
 catalogue:{title:'Digitalización oficial de Yale',url:'https://collections.library.yale.edu/catalog/2002046'},
 illustration:{title:'René Zandbergen · Descripción de las ilustraciones',url:'https://www.voynich.nu/illustr.html'},
 description:{title:'René Zandbergen · Descripción del manuscrito',url:'https://www.voynich.nu/descr.html'}
});
const entry=(id,folio,category,title,observed,interpretation,confidence,features,source='illustration')=>Object.freeze({id,folio,category,title,observed,interpretation,confidence,features,source});
export const ATLAS_ENTRIES=Object.freeze([
 entry('herb-f2v','f2v','botanica','Herbario · folio 2v','Ilustración vegetal de gran formato acompañada por líneas de escritura alrededor de la figura.','La asociación con una especie botánica concreta sigue abierta.','observacion',['planta','texto','composición']),
 entry('herb-f3r','f3r','botanica','Herbario · folio 3r','Una planta ocupa el centro de la página, siguiendo el formato de los herbarios del códice.','La comparación con otros herbarios medievales es posible, pero no prueba un nombre de especie.','observacion',['planta','herbario','texto']),
 entry('herb-f16v','f16v','botanica','Herbario · folio 16v','Página botánica catalogada por sus ilustraciones vegetales y texto.','Sus rasgos gráficos pueden analizarse sin atribuirles propiedades medicinales.','observacion',['planta','texto']),
 entry('herb-f35v','f35v','botanica','Comparación de herbarios · 35v','El dibujo de este folio ha sido comparado en la bibliografía con ilustraciones de herbarios medievales.','Se ha señalado una semejanza con ilustraciones medievales de hiedra; es una comparación iconográfica, no una identificación botánica confirmada.','hipotesis',['comparación','herbario','planta']),
 entry('herb-f49r','f49r','botanica','Herbario · folio 49r','Folio incluido entre los ejemplos de ilustraciones de la sección botánica.','La función y el nombre de la planta no pueden deducirse del texto sin descifrar.','observacion',['planta','texto']),
 entry('herb-f57r','f57r','botanica','Límite del herbario · 57r','Página clasificada dentro de las ilustraciones botánicas aunque está cerca de otras secciones.','El orden físico del manuscrito puede diferir del orden original.','hipotesis',['planta','orden','folio']),
 entry('herb-f87r','f87r','botanica','Herbario posterior · 87r','Página vegetal localizada después de las secciones centrales más conocidas.','La dispersión de las páginas botánicas es relevante para estudiar el orden del códice.','observacion',['planta','orden']),
 entry('herb-f90r','f90r','botanica','Herbario posterior · 90r','Página incluida en las agrupaciones herbales del manuscrito.','No se asigna especie ni utilidad farmacológica sin evidencia específica.','observacion',['planta','herbario']),
 entry('astro-f67r1','f67r1','astronomia','Diagramas celestes · 67r1','Composición circular clasificada por investigadores dentro del grupo astronómico.','Su relación precisa con astros, calendarios o procesos naturales no está resuelta.','observacion',['círculos','astro','diagrama']),
 entry('astro-f68r1','f68r1','astronomia','Diagramas celestes · 68r1','Diagrama con motivos propios de las páginas astronómicas.','Su lectura exacta permanece desconocida.','observacion',['diagrama','astro','círculos']),
 entry('astro-f68r3','f68r3','astronomia','Agrupación estelar · 68r3','En este folio aparece un pequeño conjunto de siete estrellas próximas.','La comparación con las Pléyades se ha propuesto en la bibliografía; no descifra las etiquetas.','hipotesis',['estrellas','Pléyades','comparación']),
 entry('zodiac-f70v1','f70v1','zodiaco','Rueda zodiacal · 70v1','Diagrama circular relacionado con la secuencia de signos zodiacales.','El reconocimiento del tipo de ilustración es más sólido que la lectura de sus leyendas.','observacion',['zodíaco','círculos','figuras']),
 entry('zodiac-f71r','f71r','zodiaco','Rueda zodiacal · 71r','Motivo zodiacal dentro de círculos concéntricos rodeados de pequeñas figuras humanas.','Las interpretaciones astrológicas del texto siguen sin verificar.','observacion',['zodíaco','figuras','estrellas']),
 entry('zodiac-f72r','f72r','zodiaco','Rueda zodiacal · 72r','Folio perteneciente a la serie de diagramas zodiacales y figuras con estrellas.','Su posible estructura calendárica es un tema de investigación, no una traducción.','observacion',['zodíaco','estrellas','calendario']),
 entry('cosmo-f69r','f69r','cosmologia','Diagrama cosmológico · 69r','Diseño geométrico circular agrupado convencionalmente entre los folios cosmológicos.','Se han buscado paralelos con diagramas medievales de los vientos; no existe lectura definitiva.','hipotesis',['círculos','vientos','comparación']),
 entry('cosmo-f69v','f69v','cosmologia','Diagrama cosmológico · 69v','Otro ejemplo de ilustración geométrica circular de clasificación cosmológica.','La finalidad del diagrama no está establecida.','observacion',['círculos','diagrama'])
]);
export const ATLAS_CATEGORIES=Object.freeze({todos:'Todas las disciplinas',botanica:'Botánica',astronomia:'Astronomía',zodiaco:'Zodíaco',cosmologia:'Cosmología'});
export const ATLAS_FAVORITES_KEY='voynich404-atlas-favorites-v1';
export const ATLAS_MAX_FAVORITES=100;
export function cleanAtlasFavorites(raw){if(!Array.isArray(raw))return [];const known=new Set(ATLAS_ENTRIES.map(x=>x.id));return [...new Set(raw.filter(x=>typeof x==='string'&&known.has(x)))].slice(0,ATLAS_MAX_FAVORITES)}
export const plain=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
export function filterAtlas(entries,{category='todos',term='',favoritesOnly=false,favorites=[]}={}){
 const needle=plain(term.trim());const fav=new Set(favorites);
 return entries.filter(x=>(category==='todos'||x.category===category)&&(!favoritesOnly||fav.has(x.id))&&(!needle||plain([x.title,x.folio,x.observed,x.interpretation,x.features.join(' ')].join(' ')).includes(needle)));
}
export function normalizedFolio(value){
 const input=plain(value).replace(/folio|fol\./g,'').replace(/recto/g,'r').replace(/verso/g,'v');
 const match=input.match(/(?:^|[^\d])(\d{1,3})\s*([rv])\s*(\d?)(?!\d)/i);
 return match?`f${Number(match[1])}${match[2]}${match[3]||''}`:null;
}
export function findAtlasFolio(pages,wanted){const token=normalizedFolio(wanted);if(!token||!Array.isArray(pages))return -1;return pages.findIndex(p=>normalizedFolio(p?.label)===token)}
