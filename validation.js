export function validateSparePart(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Data spare part tidak valid.';
  }
  const { code, name, category, unit, description } = body;
  if (typeof code !== 'string' || !code.trim() || code.trim().length > 30 ||
      typeof name !== 'string' || !name.trim() || name.trim().length > 120 ||
      typeof unit !== 'string' || !unit.trim() || unit.trim().length > 30 ||
      (category != null && (typeof category !== 'string' || category.length > 80)) ||
      (description != null && (typeof description !== 'string' || description.length > 500))) {
    return 'Kode, nama, dan satuan wajib diisi dengan panjang yang valid.';
  }
  return null;
}

export function validateTransaction(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Data transaksi tidak valid.';
  }
  const { sparePartId, type, quantity, notes } = body;
  if (!Number.isSafeInteger(Number(sparePartId)) || Number(sparePartId) < 1 ||
      !['in', 'out'].includes(type) ||
      !Number.isSafeInteger(quantity) || quantity <= 0 || quantity > 4294967295 ||
      (notes != null && (typeof notes !== 'string' || notes.length > 500))) {
    return 'Spare part, jenis, jumlah positif, atau keterangan tidak valid.';
  }
  return null;
}
