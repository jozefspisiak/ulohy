import React from 'react';
import ReactDOM from 'react-dom';

class NameAutoComplete extends React.Component {
  constructor() {
    super();
    this.emitChange = this.emitChange.bind(this);
    this.state = {html: ''}
  }

  emitChange(e){
    let element = ReactDOM.findDOMNode(this)
    let html = element.innerHTML;
    this.setState({html: html})
    let name = this.findMatchingName(html)
    let caret = this.getCaretCharacterOffsetWithin(element)
    console.log(caret)
    ReactDOM.findDOMNode(this).innerHTML = name;
  }

  findMatchingName(start){
    let names = this.state.names
    let match = names.indexOf(', ' + start)
    if (match >= 0)
      return names.substring(match+2,
        match+2+names.substring(match+2).indexOf(','))
    return start

  }

 getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection !== "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type !== "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  componentDidMount() {
		this.readTextFile(this.props.txt);
    var el = ReactDOM.findDOMNode(this);
    var range = document.createRange();
    var sel = window.getSelection();

    range.setStart(el, el.innerHTML.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
	}

	readTextFile = file => {
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = () => {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 200 || rawFile.status === 0) {
					var allNames = rawFile.responseText;

					this.setState({
						names: ', ' + allNames
					});
				}
			}
		};
		rawFile.send(null);
	};

  render() {
    return (
      <div contentEditable
      onInput={this.emitChange}
      style={{border: 'solid 2px', width: 200+'px', height: 30+'px'}}/>
    );
  }
}

export default NameAutoComplete
