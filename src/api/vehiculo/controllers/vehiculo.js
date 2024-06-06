'use strict';

/**
 * vehiculo controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::vehiculo.vehiculo', ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;
        const entity = await strapi.db.query('api::vehiculo.vehiculo').findOne({
            where: { url: id },
            populate: true,
        });
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity);
    }
}));
