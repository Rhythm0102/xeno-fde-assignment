const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check tenant (simplified)
const checkTenant = async (req, res, next) => {
    const { tenantId } = req.query;
    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
    }
    req.tenantId = tenantId;
    next();
};

router.get('/stats', checkTenant, async (req, res) => {
    const { tenantId } = req;

    try {
        const [customerCount, orderCount, productCount] = await Promise.all([
            prisma.customer.count({ where: { tenantId } }),
            prisma.order.count({ where: { tenantId } }),
            prisma.product.count({ where: { tenantId } }),
        ]);

        // Calculate total revenue
        const orders = await prisma.order.findMany({
            where: { tenantId },
            select: { totalPrice: true }
        });

        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice || '0'), 0);

        res.json({
            customers: customerCount,
            orders: orderCount,
            products: productCount,
            revenue: totalRevenue.toFixed(2),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stats' });
    }
});

router.get('/orders-by-date', checkTenant, async (req, res) => {
    const { tenantId } = req;

    try {
        // Group by date (simplified, doing aggregation in JS for DB compatibility)
        const orders = await prisma.order.findMany({
            where: { tenantId },
            select: { createdAt: true, totalPrice: true }
        });

        const grouped = {};
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!grouped[date]) grouped[date] = 0;
            grouped[date] += 1;
        });

        const result = Object.keys(grouped).map(date => ({ date, count: grouped[date] })).sort((a, b) => a.date.localeCompare(b.date));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders by date' });
    }
});

router.get('/top-customers', checkTenant, async (req, res) => {
    const { tenantId } = req;

    try {
        const customers = await prisma.customer.findMany({
            where: { tenantId },
            orderBy: { totalSpent: 'desc' }, // Note: totalSpent is string, so sorting might be lexicographical if not careful. Ideally use Decimal.
            take: 5,
        });

        // Fix sorting if needed or rely on DB if using Decimal
        // For string, "100" < "20", so we might need to sort in JS

        customers.sort((a, b) => parseFloat(b.totalSpent || '0') - parseFloat(a.totalSpent || '0'));

        res.json(customers.slice(0, 5));
    } catch (error) {
        res.status(500).json({ error: 'Error fetching top customers' });
    }
});

module.exports = router;
