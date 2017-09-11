import React from 'react';
import ReactDOM from 'react-dom';
import styles from './NameAutoComplete.css'

class NameAutoComplete extends React.Component {
  constructor() {
    super();
    this.state = {text: [], names: [], suggested: 0, caret: 0}
  }

  emitChange(ev){
    let element = ev.target
    let inputText = element.textContent
    let caret = this.getCaretCharacterOffsetWithin(element)


    inputText = inputText.split(/[\s]+/)

    // dealing with trailing spaces
    //if (inputText[inputText.length - 1] === '')
    //  inputText.pop()

    /*let i = 0
    for (let child of element.childNodes) {
      //child.textContent = inputText[i]
      //child.innerHtml += '&nbsp;'
      //console.log(child);
      if (child.nodeType === 3)
        child.textContent = ''
      i++
    }
    */

    this.setState({text: inputText, caret: caret})
  }

  handleClick(ev) {
    const element = ev.target
    const name = element.innerHTML
    const caret = this.state.caret
    let text = this.state.text

    let currentWord = this.getCurrentWord()

    const toAdd = name.substring(currentWord.length)

    text[this.getCurrentWordIndex()] = name

    this.setState({text: text, caret: caret+toAdd.length, suggested: 0})
  }

  handleKeyPress(ev) {
    let element = ev.target
    console.log(element)
    let key = ev.key
    if (key === 'Enter') {

    }
  }

  getCurrentWord() {
    const text = this.state.text
    let caret = this.state.caret

    if (text.length === 0 || caret === 0 ) return ''

    for (let name of text) {
      if (caret <= name.length)
        return name.substring(0,caret)
      else
        caret -= name.length+1
    }

    return ''
  }

  getCurrentWordIndex() {
    const text = this.state.text
    let caret = this.state.caret

    if (text.length === 0 || caret === 0 ) return 0

    let id = 0;
    for (let word of text) {
      if (caret <= word.length)
        return id
      else
        caret -= word.length+1
      id++
    }

    return text.length
  }

  findMatchingNames(){
    const start = this.getCurrentWord()

    if (start === '') return []
    const names = this.state.names

    let result = []
    for (let id in names)
      if (names[id].toLowerCase().indexOf(start.toLowerCase()) === 0)
        if (names.hasOwnProperty(id)) {
           result.push({id:id,name:names[id]})
        }

    return result
  }

  componentDidUpdate() {
    let caret = this.state.caret
    if (this.state.text.length !== 0 && caret !== 0) {
      const element = ReactDOM.findDOMNode(this).firstChild;
      let range = document.createRange()
      let sel = window.getSelection()

      // we need to clear user input because we surprassed warning
      for (let child of element.childNodes) {
        if (child.nodeType === 3)
          child.textContent = ''

        child.textContent = child.textContent.split(/[\s]+/)[0] + String.fromCharCode(160)
      }

      for (let child of element.childNodes) {
        const text = child.textContent

        if (caret <= text.length) {
          let caretNode = child.firstChild
          if (child.nodeType === 3) {
            caretNode = child
          }
          range.setStart(caretNode, caret)
          range.setEnd(caretNode, caret)
          break;
        } else {
          if (child.textContent.length > 0)
            caret -= child.textContent.length
        }
      }
      sel.removeAllRanges();
      sel.addRange(range);
      element.focus();
    }
  }

  // from https://stackoverflow.com/a/4812022
  getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0
    const doc = element.ownerDocument || element.document;
    const win = doc.defaultView || doc.parentWindow;
    let sel;
    if (typeof win.getSelection !== "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            let range = win.getSelection().getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else {
      sel = doc.selection
      if ( sel.type !== "Control") {
        let textRange = sel.createRange();
        let preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
    }
    return caretOffset;
  }

  componentDidMount() {
		this.readTextFile(this.props.txt);
	}

	readTextFile(file) {
		let rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, true);
		rawFile.onreadystatechange = () => {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 200 || rawFile.status === 0) {
          let names = rawFile.responseText.split(', ')
					this.setState({
						names: names
					});
				}
			}
		};
		rawFile.send(null);
	};

  validateName(index) {
    if (this.getCurrentWordIndex() === index)
      return ''

    const text = this.state.text
    for (let name of this.state.names)
      if (name.toLowerCase() === text[index].toLowerCase())
        return 'nameautocomplete-valid'

    return 'nameautocomplete-invalid'
  }

  render() {
    return (
      <div>
        <div
        contentEditable
        suppressContentEditableWarning
        onInput={this.emitChange.bind(this)}
        className="nameautocomplete">
          {this.state.text.map((name, index) =>
            <span key={index} className={this.validateName(index)}>
              {name + ' '}
            </span>
          )}
        </div>
        <ul>
        {this.findMatchingNames().map((name) =>
          <li key={name.id} onKeyPress={this.handleKeyPress.bind(this)} onClick={this.handleClick.bind(this)}>
            {name.name}
          </li>
        )}
        </ul>
      </div>
    );
  }
}

export default NameAutoComplete
