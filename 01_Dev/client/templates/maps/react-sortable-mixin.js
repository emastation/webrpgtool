/**
 * @author RubaXa <trash@rubaxa.org>
 * @licence MIT
 */

(function (factory) {
  'use strict';

  if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
    module.exports = factory(require('./Sortable'));
  }
  else if (typeof define === 'function' && define.amd) {
    define(['./Sortable'], factory);
  }
  else {
    window['SortableMixin'] = factory(window.Sortable);
  }
})(function (/** Sortable */Sortable) {
  'use strict';

  var _nextSibling;

  var _activeComponent;

  var _defaultOptions = {
    ref: 'list',
    model: 'items',

    animation: 100,
    onStart: 'handleStart',
    onEnd: 'handleEnd',
    onAdd: 'handleAdd',
    onUpdate: 'handleUpdate',
    onRemove: 'handleRemove',
    onSort: 'handleSort',
    onFilter: 'handleFilter'
  };


  function _getModelName(component) {
    return component.sortableOptions && component.sortableOptions.model || _defaultOptions.model;
  }


  function _getModelItems(component) {
    var name = _getModelName(component),
        items = component.state && component.state[name] || component.props[name];

    return items.slice();
  }


  function _extend(dst, src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }

    return dst;
  }


  /**
   * Simple and easy mixin-wrapper for rubaxa/Sortable library, in order to
   * make reorderable drag-and-drop lists on modern browsers and touch devices.
   *
   * @mixin
   */
  var SortableMixin = {
    sortableMixinVersion: '0.1.0',


    /**
     * @type {Sortable}
     * @private
     */
    _sortableInstance: null,


    componentDidMount: function () {
      var options = _extend(_extend({}, _defaultOptions), this.sortableOptions || {}),
          copyOptions = _extend({}, options),

          emitEvent = function (/** string */type, /** Event */evt) {
            var method = this[options[type]];
            method && method.call(this, evt, this._sortableInstance);
          }.bind(this);


      // Bind callbacks so that "this" refers to the component
      'onStart onEnd onAdd onSort onUpdate onRemove onFilter'.split(' ').forEach(function (/** string */name) {
        copyOptions[name] = function (evt) {
          if (name === 'onStart') {
            _nextSibling = evt.item.nextElementSibling;
            _activeComponent = this;
          }
          else if (name === 'onAdd' || name === 'onUpdate') {

            var newState = {},
                remoteState = {},
                oldIndex = evt.oldIndex,
                newIndex = evt.newIndex,
                items = _getModelItems(this),
                remoteItems,
                item;

            if (name === 'onAdd') {
              remoteItems = _getModelItems(_activeComponent);
              item = remoteItems.splice(oldIndex, 1)[0];
              items.splice(newIndex, 0, item);

              remoteState[_getModelName(_activeComponent)] = remoteItems;
            }
            else {
//                items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
              this.onUpdate(evt);
            }

            evt.from.insertBefore(evt.item, _nextSibling);

          }

          setTimeout(function () {
            emitEvent(name, evt);
          }, 0);
        }.bind(this);
      }, this);


      /** @namespace this.refs — http://facebook.github.io/react/docs/more-about-refs.html */
      this._sortableInstance = Sortable.create((this.refs[options.ref] || this).getDOMNode(), copyOptions);
    },


    componentWillUnmount: function () {
      this._sortableInstance.destroy();
      this._sortableInstance = null;
    },


    onUpdate: function(evt) {
      // added by emadurandal [Begin]
      var itemEl = evt.item;  // dragged HTMLElement
      evt._id = itemEl.dataset.id;
      if (evt.newIndex < evt.oldIndex) {
        // Element moved up in the list. The dropped element has a next sibling for sure.
        var orderNextItem = parseInt(itemEl.nextElementSibling.dataset.order);
        this.adjustOrders(evt._id, null, orderNextItem);
      } else if (evt.newIndex > evt.oldIndex) {
        // Element moved down in the list. The dropped element has a previous sibling for sure.
        var orderPrevItem = parseInt(itemEl.previousElementSibling.dataset.order);
        this.adjustOrders(evt._id, orderPrevItem, null);
      } else {
        // do nothing - drag and drop in the same location
      }
      // added by emadurandal [End]
    },

    /**
     * When an element was moved, adjust its orders and possibly the order of
     * other elements, so as to maintain a consistent and correct order.
     *
     * There are three approaches to this:
     * 1) Using arbitrary precision arithmetic and setting only the order of the moved
     *    element to the average of the orders of the elements around it -
     *    http://programmers.stackexchange.com/questions/266451/maintain-ordered-collection-by-updating-as-few-order-fields-as-possible
     *    The downside is that the order field in the DB will increase by one byte every
     *    time an element is reordered.
     * 2) Adjust the orders of the intervening items. This keeps the orders sane (integers)
     *    but is slower because we have to modify multiple documents.
     *    TODO: we may be able to update fewer records by only altering the
     *    order of the records between the newIndex/oldIndex and the start/end of the list.
     * 3) Use regular precision arithmetic, but when the difference between the orders of the
     *    moved item and the one before/after it falls below a certain threshold, adjust
     *    the order of that other item, and cascade doing so up or down the list.
     *    This will keep the `order` field constant in size, and will only occasionally
     *    require updating the `order` of other records.
     *
     * For now, we use approach #2.
     *
     * @param {String} itemId - the _id of the item that was moved
     * @param {Number} orderPrevItem - the order of the item before it, or null
     * @param {Number} orderNextItem - the order of the item after it, or null
     */
    adjustOrders : function adjustOrders(itemId, orderPrevItem, orderNextItem) {
      var orderField = "order";//templateInstance.options.sortField;
      var selector = {}, modifier = {$set: {}};
      var ids = [];

      var collection = Mongo.Collection.get(this.collectionName);
      var startOrder = collection.findOne(itemId)[orderField];
      if (orderPrevItem !== null) {
        // Element has a previous sibling, therefore it was moved down in the list.
        // Decrease the order of intervening elements.
        selector[orderField] = {$lte: orderPrevItem, $gt: startOrder};
        ids = _.pluck(collection.find(selector, {fields: {_id: 1}}).fetch(), '_id');
        Meteor.call('rubaxa:sortable/collection-update', this.collectionName, ids, orderField, -1);

        // Set the order of the dropped element to the order of its predecessor, whose order was decreased
        modifier.$set[orderField] = orderPrevItem;
      } else {
        // element moved up the list, increase order of intervening elements
        selector[orderField] = {$gte: orderNextItem, $lt: startOrder};
        ids = _.pluck(collection.find(selector, {fields: {_id: 1}}).fetch(), '_id');
        Meteor.call('rubaxa:sortable/collection-update', this.collectionName, ids, orderField, 1);

        // Set the order of the dropped element to the order of its successor, whose order was increased
        modifier.$set[orderField] = orderNextItem;
      }
      collection.update(itemId, modifier);
    }

  };


  // Export
  return SortableMixin;
});