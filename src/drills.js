'use strict';
require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});



function getAllItemsWithText(searchTerm) {
  knexInstance
    .select('id','name','price', 'category')
    .from('shopping_list')
    .where( 'name', 'ilike',`%${searchTerm}%`)
    .then(res => {
      console.log('Not Dogs');
    });
}
getAllItemsWithText('Not Dogs');

function getAllItemsPaginated(pageNumber) {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (pageNumber - 1);
  knexInstance
    .select('id', 'name', 'price', 'category')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(res => {
      console.log(res);
    });
}
getAllItemsPaginated(3);

function getAllAfterDate(daysAgo) {
  knexInstance
    .select('id', 'name', 'price', 'category')
    .from('shopping_list')
    .where('date_added', '>',
      knexInstance.raw('now() - \'?? days\' ::interval',daysAgo))
    .then(res => {
      console.log(res);
    });
}
getAllAfterDate(7);

function getTotalCost() {
  knexInstance
    .select('category')
    .from('shopping_list')
    .groupBy('category')
    .sum('price')
    .then(res => {
      console.log(res);
    });
}
getTotalCost('dinner');