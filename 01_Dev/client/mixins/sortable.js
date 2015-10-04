var SortableMixin = {
  init: function() {

    /*
    * @param {String} itemId - the _id of the item that was moved
    * @param {Number} orderPrevItem - the order of the item before it, or null
    * @param {Number} orderNextItem - the order of the item after it, or null
    * @param {Number} collectionName - collectionName you want to sort
    */
    var _adjustOrders = (itemId, orderPrevItem, orderNextItem, collectionName)=> {
     var orderField = "order";//templateInstance.options.sortField;
     var selector = {}, modifier = {$set: {}};
     var ids = [];

     var collection = Mongo.Collection.get(collectionName);
     var startOrder = collection.findOne(itemId)[orderField];
     if (orderPrevItem !== null) {
       // Element has a previous sibling, therefore it was moved down in the list.
       // Decrease the order of intervening elements.
       selector[orderField] = {$lte: orderPrevItem, $gt: startOrder};
       selector[collection.sortingScope] = this.sortingScopeValue;
       ids = _.pluck(collection.find(selector, {fields: {_id: 1}}).fetch(), '_id');
       Meteor.call('rubaxa:sortable/collection-update', collectionName, ids, orderField, -1);

       // Set the order of the dropped element to the order of its predecessor, whose order was decreased
       modifier.$set[orderField] = orderPrevItem;
     } else {
       // element moved up the list, increase order of intervening elements
       selector[orderField] = {$gte: orderNextItem, $lt: startOrder};
       selector[collection.sortingScope] = this.sortingScopeValue;
       ids = _.pluck(collection.find(selector, {fields: {_id: 1}}).fetch(), '_id');
       Meteor.call('rubaxa:sortable/collection-update', collectionName, ids, orderField, 1);

       // Set the order of the dropped element to the order of its successor, whose order was increased
       modifier.$set[orderField] = orderNextItem;
     }
     collection.update(itemId, modifier);
    }

    var _onStartFunc = (evt)=> {
//      this.__nextSibling = evt.item.nextElementSibling;
        this.__nextSibling = evt.item.parentNode.children[evt.oldIndex];
        console.log(this.__nextSibling);
    }

    var _swapNodes = function (/**HTMLElement*/container, /**int*/newIndex, /**int*/oldIndex) {
      var newObj = container.children[newIndex];
      var oldObj = container.children[oldIndex];

      if (newIndex > oldIndex) {
        container.insertBefore(newObj ,oldObj);
      } else {
        var nextOfOldObj = oldObj.nextElementSibling;
        if (nextOfOldObj) {
          container.insertBefore(newObj, nextOfOldObj);
        } else {
          container.appendChild(newObj);
        }
      }
    };

    var _onEndFunc = (evt)=> {

      var itemEl = evt.item;  // dragged HTMLElement
      evt._id = itemEl.dataset.id;
      if (evt.newIndex < evt.oldIndex) {
        // Element moved up in the list. The dropped element has a next sibling for sure.
        var orderNextItem = parseInt(itemEl.nextElementSibling.dataset.order);
        _swapNodes(evt.item.parentNode, evt.newIndex, evt.oldIndex); // revert elements' order change that Sortable does
        _adjustOrders(evt._id, null, orderNextItem, this.collectionName);
      } else if (evt.newIndex > evt.oldIndex) {
        // Element moved down in the list. The dropped element has a previous sibling for sure.
        var orderPrevItem = parseInt(itemEl.previousElementSibling.dataset.order);
        _swapNodes(evt.item.parentNode, evt.newIndex, evt.oldIndex); // revert elements' order change that Sortable does
        _adjustOrders(evt._id, orderPrevItem, null, this.collectionName);
      } else {
        // do nothing - drag and drop in the same location
      }

    }


    var _defaultOptions = {
      onEnd: _onEndFunc
//      onStart: _onStartFunc
    };

    this.on('mount', ()=>{
      Sortable.create($(this.sortableRoot).get(0), _defaultOptions);
    });
  },

};
riot.mixin('sortable', SortableMixin);
