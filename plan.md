# 0k

- hoc for the input from stdin
- alt+arrows - move nodes
- space - toggle collapse / expand
- think - how to store the meta-data of a mm file?
  - can use a shadow outline to hold some flags
    - [sbc] - strikethrough, bold, collapsed
- use https://www.npmjs.com/package/ansi-colors
- outline model
  - `opts: { preserveStyles: boolean }`
  - browse - `moveNode`
  - browse - `changeFocus`
    - to parent
    - to siblin
    - to cousin
- outline component
  - reorder siblins
  - move node
- mm model
  - extract commonalities with outline
  - auto-layout mode
  -

# S/M

- performance
- from stdin
- draw the curves

# in

- read about ink Static
- does re-render preserve state?
- wrap text by default?
- support copy/cut/paste
  - paste in browse mode creates child(ren) with pasted context
  - copies a text outline with `\n` and `\t`
  - copy stack / history; searchable
    - searchable
- get GuyR, AviP review
- multi-line nodes
- search; with potato
  - opens a pane on the left (new app mode) with the search box and the sorted results,
    going down the results also highlights the node on the tree!
- edit history, "undo"
  - cmd+Z
    - first take me back to where the last change was
    - next cmd+Z undo the change
- cursor history, "back"
- keep the root node centered; https://www.npmjs.com/package/term-size
- curves by something similar to boxen - https://www.compart.com/en/unicode/block/U+2500
- far fetch - multi-select

# 10k

- outline component
- permormance issue with our data model?
- hoc for input
- publish
- e2e test
- switch view modes
- read from mm file
- write to file
- fix tests on ink-text-input
- ink-test-input to support `fn + backspace` as delete
- ci
- cli options?
- config
  - key bindings
- color
- 'TODO list mode'
  - chalk strikethrough dim
- man page as mindmap
