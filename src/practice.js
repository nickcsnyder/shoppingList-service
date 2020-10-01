'use strict';
require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

const qry = knexInstance
  .from('amazong_products')
  .select('product_id', 'name', 'price', 'category')
  .where({name: 'Point of view gun'})
  .first()
  .toQuery();
console.log(qry);

// const searchTerm = 'holo';

function searchByProduceName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ilike', `%${searchTerm}'%`)
    .then(res => {
      console.log(res);
    });
}
searchByProduceName('holo');

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('product_id','name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then(res => {
      console.log(res);
    });
}

paginateProducts(2);

function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .whereNotNull('image')
    .then(res => {
      console.log(res);
    });
}
getProductsWithImages();

function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name','region') 
    .count('date_viewed as views')
    .where(
      'date_viewed', 
      '>',
      knexInstance.raw('now() - \'?? days\' ::interval',days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'asc'},
      { column: 'views', order: 'desc'},
    ])
    .then(res => {
      console.log(res);
    });
}
mostPopularVideosForDays(30);