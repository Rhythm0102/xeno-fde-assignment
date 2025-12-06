const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { shopify, getSession } = require('../shopify');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check tenant
const checkTenant = async (req, res, next) => {
    const { tenantId } = req.body;
    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
    }

    try {
        const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        req.tenant = tenant;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

// Create or Update Tenant
router.post('/tenant', async (req, res) => {
    const { shopifyDomain, accessToken, shopName } = req.body;
    try {
        const tenant = await prisma.tenant.upsert({
            where: { shopifyDomain },
            update: {
                accessToken,
                shopName,
            },
            create: {
                shopifyDomain,
                accessToken,
                shopName,
            },
        });
        res.json(tenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create/update tenant' });
    }
});

// Ingest Products
router.post('/products', checkTenant, async (req, res) => {
    const { tenant } = req;
    const session = getSession(tenant.shopifyDomain, tenant.accessToken);
    const client = new shopify.clients.Rest({ session });

    try {
        const response = await client.get({ path: 'products' });
        const products = response.body.products;

        // Upsert products
        for (const p of products) {
            await prisma.product.upsert({
                where: { id: String(p.id) },
                update: {
                    title: p.title,
                    bodyHtml: p.body_html,
                    vendor: p.vendor,
                    productType: p.product_type,
                    updatedAt: new Date(p.updated_at),
                },
                create: {
                    id: String(p.id),
                    tenantId: tenant.id,
                    title: p.title,
                    bodyHtml: p.body_html,
                    vendor: p.vendor,
                    productType: p.product_type,
                    createdAt: new Date(p.created_at),
                    updatedAt: new Date(p.updated_at),
                },
            });
        }

        res.json({ message: `Ingested ${products.length} products` });
    } catch (error) {
        console.error('Error ingesting products:', error);
        res.status(500).json({ error: 'Failed to ingest products', details: error.message });
    }
});

// Ingest Customers
router.post('/customers', checkTenant, async (req, res) => {
    const { tenant } = req;
    const session = getSession(tenant.shopifyDomain, tenant.accessToken);
    const client = new shopify.clients.Rest({ session });

    try {
        const response = await client.get({ path: 'customers' });
        const customers = response.body.customers;

        for (const c of customers) {
            await prisma.customer.upsert({
                where: { id: String(c.id) },
                update: {
                    email: c.email,
                    firstName: c.first_name,
                    lastName: c.last_name,
                    ordersCount: c.orders_count,
                    totalSpent: c.total_spent,
                    currency: c.currency,
                    updatedAt: new Date(c.updated_at),
                },
                create: {
                    id: String(c.id),
                    tenantId: tenant.id,
                    email: c.email,
                    firstName: c.first_name,
                    lastName: c.last_name,
                    ordersCount: c.orders_count,
                    totalSpent: c.total_spent,
                    currency: c.currency,
                    createdAt: new Date(c.created_at),
                    updatedAt: new Date(c.updated_at),
                },
            });
        }

        res.json({ message: `Ingested ${customers.length} customers` });
    } catch (error) {
        console.error('Error ingesting customers:', error);
        res.status(500).json({ error: 'Failed to ingest customers', details: error.message });
    }
});

// Ingest Orders
router.post('/orders', checkTenant, async (req, res) => {
    const { tenant } = req;
    const session = getSession(tenant.shopifyDomain, tenant.accessToken);
    const client = new shopify.clients.Rest({ session });

    try {
        const response = await client.get({ path: 'orders', query: { status: 'any' } });
        const orders = response.body.orders;

        for (const o of orders) {
            await prisma.order.upsert({
                where: { id: String(o.id) },
                update: {
                    customerId: o.customer ? String(o.customer.id) : null,
                    totalPrice: o.total_price,
                    financialStatus: o.financial_status,
                    processedAt: o.processed_at ? new Date(o.processed_at) : null,
                },
                create: {
                    id: String(o.id),
                    tenantId: tenant.id,
                    customerId: o.customer ? String(o.customer.id) : null,
                    orderNumber: o.order_number,
                    totalPrice: o.total_price,
                    currency: o.currency,
                    financialStatus: o.financial_status,
                    createdAt: new Date(o.created_at),
                    processedAt: o.processed_at ? new Date(o.processed_at) : null,
                },
            });
        }

        res.json({ message: `Ingested ${orders.length} orders` });
    } catch (error) {
        console.error('Error ingesting orders:', error);
        res.status(500).json({ error: 'Failed to ingest orders', details: error.message });
    }
});

module.exports = router;
