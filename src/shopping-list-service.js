'use strict';
const ShoppingListService = {
  // eslint-disable-next-line no-unused-vars
  getAllItems(knexInstance) {
    return knexInstance.select('*').from('shopping_list');
  },

  getById(knexInstance, id) {
    return knexInstance
      .from('shopping_list')
      .select()
      .where('id', id)
      .first();
  },

  deleteItem(knexInstance, id) {
    return knexInstance
      .from('shopping_list')
      .select({ id })
      .delete();
  },

  updateItem(knexInstance, id, newItemFields) {
    return knexInstance
      .where({id})
      .update(newItemFields);
  },

  insertItem(knexInstance, newItem) {
    return knexInstance
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = ShoppingListService;

