export function notFound(_req, res) {
  return res.status(404).json({ message: 'Rota não encontrada.' });
}
