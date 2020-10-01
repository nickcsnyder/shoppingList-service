'use strict';
const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');
describe('Shopping-list service object', function () {
  let db;
  let testItems = [
    {
      id: 1,
      checked: false,
      date_added: new Date('2020-08-20T02:36:17.000Z'),
      name: 'One',
      category: 'Snack',
      price: '10.10'
    },
    {
      id: 2,
      checked: false,
      date_added: new Date('2020-08-20T02:36:17.000Z'),
      name: 'two',
      category: 'Lunch',
      price: '20.20'
    },
    {
      id: 3,
      checked: false,
      date_added: new Date('2020-08-20T02:36:17.000Z'),
      name: 'three',
      category: 'Breakfast',
      price: '30.30'
    },
  ];
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });
  before(() => db('shopping_list').truncate());


  afterEach(() => db('shopping_list').truncate());

  after(() => db.destroy());

  context('Given \'shopping_list\' has data', () => {
    before(() => {
      return db
        .into('shopping_list')
        .insert(testItems);
    });
    it('getAllItems() resolves all items from \'shopping_list\' table', () => {
      const expectedItems = testItems.map(item => ({
        ...item,
        checked: false,
      }));
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(expectedItems);
        });
    });

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const idToGet = 3;
      const thirdItem = testItems[idToGet - 1];
      return ShoppingListService.getById(db, idToGet)
        .then(actual => {
          expect(actual).to.eql({
            id: idToGet,
            name: thirdItem.name,
            date_added: thirdItem.date_added,
            price: thirdItem.price,
            category: thirdItem.category,
            checked: false,
          });
        });
    });

    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const idToDelete = 3;
      return ShoppingListService.deleteItem(db, idToDelete)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testItems
            .filter(item => item.id !== idToDelete)
            .map(item => ({
              ...item,
              checked: false,
            }));
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateItem() updates an item in the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 2;
      const newItemData = {
        name: 'updated title',
        price: '22.22',
        date_added: new Date(),
        checked: true,
      };
      const originalItem = testItems[idOfItemToUpdate - 1];
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...originalItem,
            ...newItemData,
          });
        });
    });
  });
    context('Given \'shopping_list\' has no data', () => {
      it('getAllItems() resolves an empty array', () => {
        return ShoppingListService.getAllItems(db)
          .then(actual => {
            expect(actual).to.eql([]);
          });
      });
    
    it('insertItem() inserts a new item and resolves the new item with an \'id\'', () => {
      const newItem = {
        name: 'Test new name name',
        price: '10.10',
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        checked: true,
        category: 'Dinner',
      };
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: newItem.date_added,
            checked: newItem.checked,
            category: newItem.category,
          });
        });
    });
  });
});
