'use strict';

/**
 *  image controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::region.region', {
  async findOne(ctx) {
    try {
      const { medusaId } = ctx.params
      const region = await strapi
        .query("region", "")
        .findOne({ region_id: medusaId })
      if (region && region.id) {
        return ctx.body = { region };
      }
      return ctx.notFound(ctx)
    } catch (e) {
      return ctx.internalServerError(ctx)
    }
  },
  async create(ctx) {
    try {
      const regionBody = ctx.request.body
      Object.keys(regionBody).forEach(
        (key) => regionBody[key] === undefined && delete regionBody[key]
      )

      const create = await strapi.service('api::region.region').createWithRelations(
        regionBody
      )
      if (create) {
        return ctx.body = { id: create }
      }
      return ctx.badRequest(ctx)
    } catch (e) {
      return ctx.internalServerError(ctx, e)
    }
  },
  async update(ctx) {
    try {
      const { medusaId } = ctx.params
      const regionBody = ctx.request.body
      Object.keys(regionBody).forEach(
        (key) => regionBody[key] === undefined && delete regionBody[key]
      )

      const found = await strapi.db.query('api::region.region').findOne({
        medusa_id: medusaId,
      })

      if (found) {
        const update = await strapi.service('api::region.region').updateWithRelations(
          regionBody
        )
        if (update) {
          return ctx.body = { id: update }
        }
      }

      const create = await strapi.service('api::region.region').createWithRelations(
        regionBody
      )
      if (create) {
        return ctx.body = { id: create }
      }

      return ctx.notFound(ctx)
    } catch (e) {
      return ctx.internalServerError(ctx, e)
    }
  },
})
