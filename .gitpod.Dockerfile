FROM gitpod/workspace-full

USER gitpod

RUN sudo curl https://beyondgrep.com/ack-v3.5.0 \
        -o /usr/bin/ack \
    && sudo chmod 0755 /usr/bin/ack \
    && sudo git clone https://github.com/nitsanavni/dotfiles.git ${HOME}/dotfiles  \
    && sudo cp ${HOME}/dotfiles/.bash_aliases ${HOME} \
    && sudo git config --global include.path ${HOME}/dotfiles/.gitconfig \
    && sudo apt-get update \
    && sudo apt-get install -y zsh \
    && brew install zsh-history-substring-search \
    && brew install gh

RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh