mindmaps for the cli

**note: this is still in initial stages of development, data may be lost, I recommend backing up your files**

# install

```
$ npm i -g mind-map-cli
```

# usage

## launch

```
$ mm <file>
```

opens existing file or creates a new one

the file is saved on each change

## keys

| key                      | function                                              |
| ------------------------ | ----------------------------------------------------- |
| arrows                   | move around                                           |
| escape                   | go to (visible) root node                             |
| return                   | add child node / exit edit node                       |
| alt + return / backspace | enter edit node                                       |
| tab                      | add siblin node                                       |
| delete / d               | delete node and its sub-tree                          |
| alt + arrows             | move node with its sub-tree                           |
| alt + .                  | toggle 'zoom in' on node                              |
| space                    | toggle collapse                                       |
| ctrl + space             | toggle deep collapse                                  |
| v                        | toggle outline / mindmap (outline mode is not stable) |
| q                        | exit                                                  |
