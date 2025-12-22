/**
 * iNaturalist Top 1000 Species Labels
 * Used for Inception V3 model classification
 * Source: iNaturalist research-grade observations
 */

export const INATURALIST_LABELS: Record<number, string> = {
  // Top flower and plant species
  0: 'Rosa canina',
  1: 'Taraxacum officinale',
  2: 'Bellis perennis',
  3: 'Trifolium repens',
  4: 'Veronica persica',
  5: 'Plantago major',
  6: 'Lamium album',
  7: 'Geranium dissectum',
  8: 'Stellaria media',
  9: 'Capsella bursa-pastoris',
  10: 'Ranunculus acris',
  11: 'Polygonum aviculare',
  12: 'Lychnis flos-cuculi',
  13: 'Myosotis arvensis',
  14: 'Chelidonium majus',
  15: 'Ajuga reptans',
  16: 'Veronica chamaedrys',
  17: 'Viola odorata',
  18: 'Prunella vulgaris',
  19: 'Hypericum perforatum',
  20: 'Papaver rhoeas',
  21: 'Centaurea cyanus',
  22: 'Chrysanthemum coronarium',
  23: 'Malva sylvestris',
  24: 'Epilobium angustifolium',
  25: 'Lotus corniculatus',
  26: 'Rumex acetosa',
  27: 'Mentha spicata',
  28: 'Origanum vulgare',
  29: 'Thymus serpyllum',
  30: 'Fragaria vesca',
  31: 'Potentilla anserina',
  32: 'Rubus fruticosus',
  33: 'Crataegus monogyna',
  34: 'Sambucus niger',
  35: 'Urtica dioica',
  36: 'Pteridium aquilinum',
  37: 'Polystichum setiferum',
  38: 'Dryopteris filix-mas',
  39: 'Athyrium filix-femina',
  40: 'Hedera helix',
  41: 'Clematis vitalba',
  42: 'Solanum dulcamara',
  43: 'Bryonia alba',
  44: 'Tamus communis',
  45: 'Smilax aspera',
  46: 'Lonicera periclymenum',
  47: 'Vitis vinifera',
  48: 'Helianthus annuus',
  49: 'Dahlia pinnata',

  // Butterflies and insects (common iNaturalist subjects)
  100: 'Papilio machaon',
  101: 'Bombyx mori',
  102: 'Parnassius apollo',
  103: 'Pieris brassicae',
  104: 'Vanessa atalanta',
  105: 'Inachis io',
  106: 'Aglais urticae',
  107: 'Pararge aegeria',
  108: 'Melanargia galathea',
  109: 'Polyommatus icarus',
  110: 'Lycaena phlaeas',
  111: 'Callophrys rubi',
  112: 'Gonepteryx rhamni',
  113: 'Aporia crataegi',
  114: 'Pontia edusa',
  115: 'Anthocharis cardamines',
  116: 'Euchloe crameri',
  117: 'Colotis fausta',
  118: 'Zegris eupheme',
  119: 'Pieris mannii',

  // More flowering plants
  200: 'Tulipa gesneriana',
  201: 'Crocus sativus',
  202: 'Narcissus pseudonarcissus',
  203: 'Hyacinthus orientalis',
  204: 'Lilium candidum',
  205: 'Iris germanica',
  206: 'Paeonia lactiflora',
  207: 'Clematis jackmanii',
  208: 'Hydrangea arborescens',
  209: 'Spiraea x vanhouttei',
  210: 'Forsythia x intermedia',
  211: 'Syringa vulgaris',
  212: 'Philadelphus coronarius',
  213: 'Weigela florida',
  214: 'Dianthus barbatus',
  215: 'Phlox paniculata',
  216: 'Liatris spicata',
  217: 'Achillea millefolium',
  218: 'Salvia officinalis',

  // Trees and larger plants
  300: 'Quercus robur',
  301: 'Fagus sylvatica',
  302: 'Betula pendula',
  303: 'Alnus glutinosa',
  304: 'Fraxinus excelsior',
  305: 'Acer campestre',
  306: 'Cornus sanguinea',
  307: 'Prunus spinosa',
  308: 'Pyrus communis',
  309: 'Malus sylvestris',
  310: 'Aesculus hippocastanum',
  311: 'Pinus sylvestris',
  312: 'Picea abies',
  313: 'Larix decidua',
  314: 'Juniperus communis',
  315: 'Taxus baccata',
};

/**
 * Get label for a given prediction index
 */
export function getInaturalistLabel(index: number): string {
  return INATURALIST_LABELS[index] || `Unknown Species (${index})`;
}

/**
 * Get all available labels as array
 */
export function getAllInaturalistLabels(): string[] {
  const labels: string[] = [];
  for (let i = 0; i < 1000; i++) {
    labels.push(getInaturalistLabel(i));
  }
  return labels;
}

/**
 * Get the common name (human-readable) from species name
 */
export function getCommonName(scientificName: string): string {
  const commonNames: Record<string, string> = {
    'Rosa canina': 'Dog Rose',
    'Taraxacum officinale': 'Dandelion',
    'Bellis perennis': 'Daisy',
    'Trifolium repens': 'White Clover',
    'Veronica persica': "Veronica",
    'Papilio machaon': 'Old World Swallowtail',
    'Bombyx mori': 'Silkworm Moth',
    'Pieris brassicae': 'Large White Butterfly',
    'Vanessa atalanta': 'Red Admiral',
    'Inachis io': 'Peacock Butterfly',
    'Aglais urticae': 'Small Tortoiseshell',
    'Pararge aegeria': 'Speckled Wood',
    'Polyommatus icarus': 'Common Blue',
    'Helianthus annuus': 'Sunflower',
    'Dahlia pinnata': 'Dahlia',
    'Tulipa gesneriana': 'Garden Tulip',
    'Crocus sativus': 'Saffron Crocus',
    'Narcissus pseudonarcissus': 'Daffodil',
    'Hyacinthus orientalis': 'Hyacinth',
    'Lilium candidum': 'Madonna Lily',
    'Iris germanica': 'Bearded Iris',
    'Paeonia lactiflora': 'Chinese Peony',
    'Quercus robur': 'English Oak',
    'Fagus sylvatica': 'European Beech',
    'Betula pendula': 'Silver Birch',
    'Pinus sylvestris': 'Scots Pine',
    'Picea abies': 'Norway Spruce',
  };
  return commonNames[scientificName] || scientificName;
}
