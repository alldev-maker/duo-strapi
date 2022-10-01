'use strict';

/**
 *  product-variant controller
 */

function performCleanups(productVariantBody) {
  Object.keys(productVariantBody).forEach(
    (key) =>
      productVariantBody[key] === undefined && delete productVariantBody[key]
  )
  delete productVariantBody.product
  delete productVariantBody.product_id
  // Since strapi doesn't allow us to create a model with name "length". We have created it with name "product_variant_length".
  productVariantBody.product_variant_length = productVariantBody.length
  delete productVariantBody.length
}

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product-variant.product-variant', {
  async findOne(ctx) {
    try {
      const { medusaId } = ctx.params
      const productVariant = await strapi
        .strapi.db.query("api::product-variant.product-variant")
        .findOne({ 
          where: {product_variant_id: medusaId}
         })
      if (productVariant && productVariant.id) {
        return ctx.body = { productVariant }
      }
      return ctx.notFound(ctx)
    } catch (e) {
      return ctx.internalServerError(ctx, e)
    }
  },
  async create(ctx) {
    try {
      const productVariantBody = ctx.request.body

      const product = productVariantBody.product
      // The product for this productVariant must exist. Otherwise we error out.
      if (!product) {
        return ctx.badRequest(
          ctx,
          "Orphaned product variant"
        )
      }

      performCleanups(productVariantBody)

      const create = await strapi.service('api::product-variant.product-variant').createWithRelations(productVariantBody)
      if (create) {
        return ctx.body = { id: create }
      }
      return ctx.badRequest(ctx)
    } catch (e) {
      console.log(e);
      return ctx.internalServerError(ctx, e)
    }
  },
  async update(ctx) {
    try {
      const { medusaId } = ctx.params
      const productVariantBody = ctx.request.body

      const product = productVariantBody.product
      // The product for this productVariant must exist. Otherwise we error out.
      if (!product) {
        return ctx.badRequest(
          ctx,
          "Orphaned product variant"
        )
      }

      performCleanups(productVariantBody)

      const found = await strapi.db.query('api::product-variant.product-variant').findOne({
        medusa_id: medusaId,
      })

      if (found) {
        const update = await strapi.service('api::product-variant.product-variant').updateWithRelations(productVariantBody)
        if (update) {
          return ctx.body = { id: update }
        } else {
          return ctx.internalServerError(ctx, "ERROR")
        }
      }

      const create = await strapi.service('api::product-variant.product-variant').createWithRelations(productVariantBody)
      if (create) {
        return ctx.body = { id: create }
      }

      return ctx.notFound(ctx)
    } catch (e) {
      return ctx.internalServerError(ctx, e)
    }
  },
  async delete(ctx) {
    try {
      const { medusaId } = ctx.params
      const productVariant = await strapi
        .query("product-variant", "")
        .findOne({ medusa_id: medusaId })
      if (productVariant) {
        await strapi.query("product-variant", "").delete({
          medusa_id: medusaId,
        })
        return ctx.body = {
          id: productVariant.id,
        }
      }
      return ctx.notFound(ctx)
    } catch (e) {
      console.log("Error occurred while trying to delete product variant")
      return ctx.internalServerError(ctx, e)
    }
  },
})
