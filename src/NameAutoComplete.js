import './NameAutoComplete.css'
import React from 'react'

class NameAutoComplete extends React.Component {

  constructor() {

    super()
    // it's ugly to store html in the state - there are many valid html for the same (visual) state
    // so to do anything meaningfull with the html is to parse it. IMO stored should be
    // either the array of  words (preferred) or the input string with exactly one
    // space separating the words.
    this.state = {
      caret: 0,
      html: '',
      names: [],
      suggested: 0,
    }

    //setTimeout(() => {
    //  console.log('10 seconds elapsed') // eslint-disable-line no-console
    //  this.setState({html: '<span> tututu </span>'})
    //  this.setState({caret: 10})
    //}, 10000)

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

  // this function's name tells me nothing. Actually it is a bit misleading as it does not emit
  // anything.
  //
  // Note that this function takes ev only to take out target attribute out of it. It seems that the
  // function (for whatever it does) does not need the whole event object at all - so it shouldn't
  // ask for it. Moreover:
  //
  // If I get it right, the element is always the same dom element. No need to even ask for it in
  // the function.
  //
  // fixed!
  contenteditableInputChanged() {

    const element = this.contentnode,
      // inputText should be taken from state. This is however part of the former objection.
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
    // finding out `name` this way is ugly / fragile. For example, what if the name was elipsized /
    // uppercased / ... ? you should only read some ID from the clicked element
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
    // comment, what the following block of code does
    for (const word of words) {

      if (letterCount <= caret && letterCount + word.length >= caret) {
        replacedText += name
      } else {
        replacedText += word
      }
      if (i < words.length && word.length > 0) {
        // Comment. What's wrong about simple space?
        //
        // Reducing multiple spaces to one is something that deserves a comment as well.
        //
        // BUG: If the are multiple spaces before the currently editing name, the cursor jumps to the
        // wrong position. Not sure, how it is even possible to produce more than one space in a
        // row, if you always keep just one? Maybe the compoent is only half-managed?

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

        // why do you think it is bad? Generally, I have no problem with it :)
        // This is bad, we should create and dispatch new event instead  of reusing
        // fixed by not needing the event
        this.contenteditableInputChanged()
        break
      }
      case 'ArrowRight': {
        if (!element.isContentEditable) {break}

        // Same here as above
        this.contenteditableInputChanged()
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
      // it's often a good idea to also strip accents
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

  // use some nice `fetch` function.
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

  // until the names are fetched, there is no reason to render anything. User won't be able to use
  // the app properly.
  render() {

    return (
      <div>
        <div
          className="nameautocomplete"
          contentEditable
          dangerouslySetInnerHTML={{__html: this.state.html}}
          onInput={this.contenteditableInputChanged.bind(this)}
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
