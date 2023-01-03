#!/bin/bash

# update
echo 'y' | apt-get update

# install docker
snap install docker

# made port can be visited in public network
apt-get install ufw
echo 'y' | ufw enable
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000:9999/tcp



# install zsh
echo 'y' | apt-get install zsh
rm -rf /root/.oh-my-zsh
echo 'y' | sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
chsh -s $(which zsh)
