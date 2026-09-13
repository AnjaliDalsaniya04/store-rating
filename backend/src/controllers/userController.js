const prisma = require("../config/prisma");

// GET /stores?name=&address= -> list all stores with overall rating + this user's rating
async function listStoresForUser(req, res) {
  const { name, address } = req.query;
  const where = {};
  if (name) where.name = { contains: name, mode: "insensitive" };
  if (address) where.address = { contains: address, mode: "insensitive" };

  try {
    const stores = await prisma.store.findMany({
      where,
      include: { ratings: true },
      orderBy: { name: "asc" },
    });

    const result = stores.map((s) => {
      const overall = s.ratings.length
        ? Number((s.ratings.reduce((sum, r) => sum + r.rating, 0) / s.ratings.length).toFixed(2))
        : 0;
      const mine = s.ratings.find((r) => r.userId === req.user.id);
      return {
        id: s.id,
        name: s.name,
        address: s.address,
        overallRating: overall,
        yourRating: mine ? mine.rating : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error listing stores" });
  }
}

// POST /stores/:id/rating -> create or update (upsert) the user's rating
async function submitRating(req, res) {
  const storeId = Number(req.params.id);
  const { rating } = req.validatedBody;

  try {
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const result = await prisma.rating.upsert({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      update: { rating },
      create: { userId: req.user.id, storeId, rating },
    });

    res.json({ message: "Rating saved", rating: result.rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error submitting rating" });
  }
}

module.exports = { listStoresForUser, submitRating };