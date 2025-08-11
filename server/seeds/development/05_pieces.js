/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Clear tables first (pieces depends on piece_sets)
  await knex('pieces').del();
  await knex('piece_sets').del();

  // Piece sets with all data in one place
  const pieceSets = [
    {
      name: 'Default',
      description: 'Default chess set',
      rarity: 'common',
      baseUrl: 'default',
      pieces: {
        k: { b: "The default king", w: "The default king" },
        q: { b: "The default queen", w: "The default queen" },
        r: { b: "The default rook", w: "The default rook" },
        n: { b: "The default knight", w: "The default knight" },
        b: { b: "The default bishop", w: "The default bishop" },
        p: { b: "The default pawn", w: "The default pawn" },
      },
    },
    {
      name: 'Beta',
      description: 'Limited edition beta set',
      rarity: 'common',
      baseUrl: 'beta',
      pieces: {
        k: { b: "Limited edition king from the beta release", w: "Limited edition king from the beta release" },
        q: { b: "Limited edition queen from the beta release", w: "Limited edition queen from the beta release" },
        r: { b: "Limited edition rook from the beta release", w: "Limited edition rook from the beta release" },
        n: { b: "Limited edition knight from the beta release", w: "Limited edition knight from the beta release" },
        b: { b: "Limited edition bishop from the beta release", w: "Limited edition bishop from the beta release" },
        p: { b: "Limited edition pawn from the beta release", w: "Limited edition pawn from the beta release" },
      },
    },
  ];

  // Define piece types and colors
  const pieceTypes = [
    { type: 'k', name: 'king' },
    { type: 'q', name: 'queen' },
    { type: 'r', name: 'rook' },
    { type: 'n', name: 'knight' },
    { type: 'b', name: 'bishop' },
    { type: 'p', name: 'pawn' },
  ];

  const colors = [
    { code: 'b', label: 'black' },
    { code: 'w', label: 'white' },
  ];

  // Insert piece sets and get inserted IDs
  const insertedSets = await knex('piece_sets')
    .insert(pieceSets.map(({ name, description, rarity }) => ({ name, description, rarity })))
    .returning(['id', 'name']);

  const pieceSetIdMap = Object.fromEntries(insertedSets.map(set => [set.name, set.id]));

  // Build pieces array
  const piecesToInsert = [];

  for (const set of pieceSets) {
    const setId = pieceSetIdMap[set.name];

    for (const color of colors) {
      for (const piece of pieceTypes) {
        piecesToInsert.push({
          name: set.name,
          piece_set_id: setId,
          image_url: `chess_piece/${set.baseUrl}/${color.code}/${piece.type}.png`,
          description: set.pieces[piece.type][color.code] || "No description available",
          rarity: set.rarity,
          type: piece.type,
          color: color.code
        });
      }
    }
  }

  await knex('pieces').insert(piecesToInsert);

  console.log(`Inserted ${pieceSets.length} piece sets and ${piecesToInsert.length} pieces.`);
}
