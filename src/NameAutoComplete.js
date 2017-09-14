import './NameAutoComplete.css'
import React from 'react'

class NameAutoComplete extends React.Component {

  constructor() {

    super()
    this.state = {
      caret: 0,
      html: '',
      names: [],
      suggested: 0,
    }

  }

  componentDidUpdate() {

    let caret = this.state.caret
    if (this.state.html.length !== 0 && caret !== 0) {

      const contentEditableElement = this.contentnode,
        range = document.createRange(),
        sel = window.getSelection()

      for (const child of contentEditableElement.childNodes) {

        const text = child.textContent

        if (caret <= text.length) {

          // Select the span element
          let caretNode = child.firstChild

          // If the text was not wrapped in span yet, but we have text
          if (child.nodeType === 3) {caretNode = child}

          range.setStart(caretNode, caret)
          range.setEnd(caretNode, caret)
          break

        } else if (child.textContent.length > 0) {
          caret -= child.textContent.length
        }

      }
      sel.removeAllRanges()
      sel.addRange(range)
      contentEditableElement.focus()

    }

  }

  emitChange(ev) {

    const element = ev.target,
      inputText = element.textContent
    let caret = this.getCaretCharacterOffsetWithin(element)
    const html = this.processText(inputText, caret),
      caretMax = this.stripHtml(html).length

    // We did strip whitespaces, so we do not want cursor to jump
    if (caret > caretMax) {caret = caretMax}


    this.setState({
      html,
      caret,
      suggested: 0,
    })

  }

  processText(inputText, caret) {

    inputText = inputText.split(/[\s]+/)

    let html = ''
    let i = 1
    for (const word of inputText) {

      if (word !== '') {

        const isValidName = this.isValidName(word)
        let classMarkup = ''
        if (caret <= word.length && caret > 0 && !isValidName) {
          // This is current word in writing, leave class empty
        } else if (isValidName) {
          classMarkup = ' class="nameautocomplete-valid"'
        } else {
          classMarkup = ' class="nameautocomplete-invalid"'
        }

        let separator = String.fromCharCode(160)
        if (inputText.length === i) {separator = ''}

        html += `<span${classMarkup}>${word}</span>${separator}`
        caret -= word.length
        if (separator.length > 0) {caret--}

      }
      i++

    }

    return html

  }

  handleClick(ev) {

    const element = ev.target,
      name = element.innerHTML
    let caret = this.state.caret,
      html = this.state.html

    const currentWord = this.getCurrentWord(),
      toAdd = name.substring(currentWord.length),
      text = this.stripHtml(html),
      words = text.split(/[\s]+/)
    let letterCount = 0
    let replacedText = ''
    let i = 0
    for (const word of words) {

      if (letterCount <= caret && letterCount + word.length >= caret) {
        replacedText += name
      } else {
        replacedText += word
      }
      if (i < words.length && word.length > 0) {
        replacedText += String.fromCharCode(160)
        letterCount++
      }
      letterCount += word.length
      i++
    }

    caret += toAdd.length
    html = this.processText(replacedText, caret)

    this.setState({
      html,
      caret,
      suggested: 0,
    })

  }

  handleKeyDown(ev) {

    const key = ev.key
    const element = ev.target
    let suggested = this.state.suggested
    const suggestedElements = this.ulnode.childNodes

    switch (key) {

      case 'Enter': {
        // We do not want a new line in the contentEditable
        ev.preventDefault()
        if (suggested < suggestedElements.length) {
          suggestedElements[suggested].click()
        }
        break
      }
      case 'ArrowDown': {
        ev.preventDefault()
        const max = suggestedElements.length - 1
        if (suggested < max) {suggested++}

        this.setState({suggested})
        break
      }
      case 'ArrowUp': {
        ev.preventDefault()
        if (suggested > 0) {suggested--}

        this.setState({suggested})
        break
      }
      case 'ArrowLeft': {
        if (!element.isContentEditable) {break}

        // This is bad, we should create and dispatch new event instead  of reusing
        this.emitChange(ev)
        break
      }
      case 'ArrowRight': {
        if (!element.isContentEditable) {break}

        // Same here as above
        this.emitChange(ev)
        break
      }
      default:

    }

  }

  stripHtml(html) {

    // From https://stackoverflow.com/a/5002618
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''

  }

  getCurrentWord() {

    const caret = this.state.caret,
      html = this.state.html

    if (html.length === 0 || caret === 0) {return ''}


    const text = this.stripHtml(html),
      textUntilCaret = text.substring(0, caret),
      splitByWhitespace = textUntilCaret.split(/[\s]+/)

    return splitByWhitespace[splitByWhitespace.length - 1]

  }

  findMatchingNames() {

    const start = this.getCurrentWord()

    if (start === '') {return []}

    const names = this.state.names,
      result = []
    let id = 0
    for (const name of names) {
      if (name.toLowerCase().indexOf(start.toLowerCase()) === 0 &&
                name.toLowerCase() !== start.toLowerCase()) {

        result.push({
          id,
          name: names[id],
        })
      }
      id++
    }

    return result

  }

  // From https://stackoverflow.com/a/4812022
  getCaretCharacterOffsetWithin(element) {

    const doc = element.ownerDocument || element.document,
      win = doc.defaultView || doc.parentWindow
    let caretOffset = 0,
      sel = doc.selection
    if (typeof win.getSelection !== 'undefined') {
      sel = win.getSelection()
      if (sel.rangeCount > 0) {
        const range = win.getSelection().getRangeAt(0),
          preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(element)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        caretOffset = preCaretRange.toString().length
      }
    } else if (sel.type !== 'Control') {
      const preCaretTextRange = doc.body.createTextRange(),
        textRange = sel.createRange()
      preCaretTextRange.moveToElementText(element)
      preCaretTextRange.setEndPoint('EndToEnd', textRange)
      caretOffset = preCaretTextRange.text.length
    }
    return caretOffset

  }

  componentDidMount() {
    this.readTextFile(this.props.txt)
  }

  readTextFile(file) {
    const request = new XMLHttpRequest()
    request.open('GET', file, true)
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200 || request.status === 0) {
          const names = request.responseText.split(', ')
          this.setState({names})
        }
      }
    }
    request.send(null)
  }

  isValidName(name) {
    for (const listname of this.state.names) {
      if (listname.toLowerCase() === name.toLowerCase()) {
        return true
      }
    }
    return false
  }

  getClassForSuggested(index) {
    if (index === this.state.suggested) {
      return 'nameautocomplete-selected'
    }
    return ''
  }

  render() {

    return (
      <div>
        <div
          className="nameautocomplete"
          contentEditable
          dangerouslySetInnerHTML={{__html: this.state.html}}
          onInput={this.emitChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          ref={(contentnode) => (this.contentnode = contentnode)}
          suppressContentEditableWarning
        />
        <ul ref={(ulnode) => (this.ulnode = ulnode)}>
          {this.findMatchingNames().map((name, index) =>
            (<li
              className={this.getClassForSuggested(index)}
              key={name.id}
              onKeyDown={this.handleKeyDown.bind(this)}
              onClick={this.handleClick.bind(this)}
            >
              {name.name}
            </li>)

          )}
        </ul>
      </div>
    )
  }
}

export default NameAutoComplete
