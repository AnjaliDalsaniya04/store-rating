const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

// GET /admin/dashboard
async function getDashboard(req, res) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching dashboard" });
  }
}

// POST /admin/users -> create USER, ADMIN, or STORE_OWNER
async function createUser(req, res) {
  const { name, email, address, password, role } = req.validatedBody;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, address, password: hashed, role },
    });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating user" });
  }
}

// Helper: case-insensitive "contains" filter for name/email/address
function buildContainsFilter(query) {
  const where = {};
  for (const field of ["name", "email", "address"]) {
    if (query[field]) {
      where[field] = { contains: query[field], mode: "insensitive" };
    }
  }
  return where;
}

// GET /admin/users?name=&email=&address=&role=&sortBy=&order=
async function listUsers(req, res) {
  const { role, sortBy = "name", order = "asc" } = req.query;
  const where = buildContainsFilter(req.query);
  if (role) where.role = role;

  const allowedSort = ["name", "email", "address", "role", "createdAt"];
  const orderBy = { [allowedSort.includes(sortBy) ? sortBy : "name"]: order === "desc" ? "desc" : "asc" };

  try {
    const users = await prisma.user.findMany({
      where,
      orderBy,
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error listing users" });
  }
}

// GET /admin/users/:id -> includes rating if role is STORE_OWNER
async function getUserDetail(req, res) {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: { select: { id: true, name: true, email: true, address: true, ratings: { select: { rating: true } } } },
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    let avgRating = null;
    if (user.role === "STORE_OWNER" && user.store) {
      const ratings = user.store.ratings;
      avgRating = ratings.length
        ? Number((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(2))
        : 0;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      ...(user.role === "STORE_OWNER" ? {
        rating: avgRating,
        store: user.store
          ? { id: user.store.id, name: user.store.name, email: user.store.email, address: user.store.address }
          : null,
      } : {}),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching user detail" });
  }
}

// POST /admin/stores
async function createStore(req, res) {
  const { name, email, address, ownerId } = req.validatedBody;
  try {
    const existing = await prisma.store.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Store email already exists" });

    if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId } });
      if (!owner || owner.role !== "STORE_OWNER") {
        return res.status(400).json({ message: "ownerId must belong to a STORE_OWNER user" });
      }
    }

    const store = await prisma.store.create({ data: { name, email, address, ownerId: ownerId || null } });
    res.status(201).json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating store" });
  }
}

// GET /admin/stores?name=&email=&address=&sortBy=&order=
async function listStores(req, res) {
  const { sortBy = "name", order = "asc" } = req.query;
  const where = buildContainsFilter(req.query);
  const allowedSort = ["name", "email", "address", "createdAt"];
  const orderBy = { [allowedSort.includes(sortBy) ? sortBy : "name"]: order === "desc" ? "desc" : "asc" };

  try {
    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: { ratings: { select: { rating: true } } },
    });

    const result = stores.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      rating: s.ratings.length
        ? Number((s.ratings.reduce((sum, r) => sum + r.rating, 0) / s.ratings.length).toFixed(2))
        : 0,
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error listing stores" });
  }
}

module.exports = { getDashboard, createUser, listUsers, getUserDetail, createStore, listStores };