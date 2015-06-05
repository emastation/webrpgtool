// see https://github.com/reactjs/react-meteor

IncludeSortableTemplate = React.createClass({
  componentDidMount: function() {
    var componentRoot = React.findDOMNode(this);
    var parentNode = componentRoot.parentNode;
    parentNode.removeChild(componentRoot);

    /*
     var that = this;
     this.props.template.helpers({
     models: function () {
     return that.props.models;
     }
     });
     */
//    return Blaze.render(this.props.template, parentNode);
    return Blaze.renderWithData(this.props.template, {data: {items: this.props.items, sortField: this.props.sortField, animation: this.props.animation, handle: this.props.handle, options: this.props.options}}, parentNode);
//    return Blaze.renderWithData(this.props.template, {items: this.props.items, sortField: this.props.sortField, animation: this.props.animation, handle: this.props.handle, options: this.props.options}, parentNode);

  },
  render: function(template) {
    return (<div />);
    /*
    return (<div data-id={order} class="sortable-item removable well well-sm">
      <i class="sortable-handle mdi-action-view-headline pull-right">=</i>
      <span class="name">{title}</span>
      <span class="badge">{order}</span>
    </div>);
    */
  }
});
