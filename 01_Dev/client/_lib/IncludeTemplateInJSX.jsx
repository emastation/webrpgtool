// see https://github.com/reactjs/react-meteor

IncludeTemplate = React.createClass({
  componentDidMount: function() {
    var componentRoot = React.findDOMNode(this);
    var parentNode = componentRoot.parentNode;
    parentNode.removeChild(componentRoot);

    return Blaze.render(this.props.template, parentNode);
//    return Blaze.renderWithData(this.props.template, {models: this.props.models, options: this.props.options}, parentNode);


  },
  render: function(template) {
    return (<div />);
  }
});
