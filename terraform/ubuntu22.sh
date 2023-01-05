#!/bin/bash

# update
echo 'y' | apt-get update

# install docker
snap install docker

# made port can be visited in public network
# apt-get install ufw
# echo 'y' | ufw enable
# ufw allow 80/tcp
# ufw allow 443/tcp
# ufw allow 3000:9999/tcp



# install zsh
echo 'y' | apt-get install zsh
rm -rf /root/.oh-my-zsh
echo 'y' | sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
chsh -s $(which zsh)

# add 2 zsh plugin
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# setup zsh config

echo 'alias public_ip="dig -4 TXT +short o-o.myaddr.l.google.com @ns1.google.com"

export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="bira"

plugins=(
  ansible
  docker
  emoji
  git
  git-flow
  terraform
  github
  yarn
  aws
  npm
  nvm
  zsh-autosuggestions
  zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh' > ~/.zshrc
