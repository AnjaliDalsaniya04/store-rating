const prisma = require("../config/prisma");

// GET /store-owner/dashboard
async function getOwnerDashboard(req, res) {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.user.id },
      include: {
        ratings: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "No store is linked to this owner account" });
    }

    const avgRating = store.ratings.length
      ? Number((store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(2))
      : 0;

    res.json({
      storeId: store.id,
      storeName: store.name,
      averageRating: avgRating,
      raters: store.ratings.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        rating: r.rating,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching owner dashboard" });
  }
}

module.exports = { getOwnerDashboard };