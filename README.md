# [Chatroom](http://plhh.xyz/) &middot; [![Github Action Status](https://github.com/plh2/chatroom/actions/workflows/github-CICD-actions.yml/badge.svg)](https://github.com/plh2/chatroom/actions) [![Github Action Status](https://github.com/plh2/chatroom/actions/workflows/main.yml/badge.svg)](https://github.com/plh2/chatroom/actions) [![Netlify Status](https://api.netlify.com/api/v1/badges/12d2c466-96f3-49a6-91f1-af835e81396a/deploy-status)](https://app.netlify.com/sites/plh-chat/deploys)



## Architecture

- Development(lerna)
  - datebase
    - mongodb
  - ansible
  - terraform
  - nignx gateway
  - package
    - frontend
      - vite[unplugin-auto-import/vite]
      - eslint+prettier
      - react+hook+ts+redux
      - @chakra-ui/react
      - tailwind
      - socket-io/client
      - Netlify
    - backend
      - node+ts
      - socket.io
      - Koa
      - cors
      - koa-router
      - koa-static
      - AWS

## Dev

```bash
yarn
npm install
yarn run dev
```

## Deploy

- terraoform create a Vultr EC2 service
- ansible create vm environment
- ansible clone project
- install dependences
- build project
- deploy project inside docker

## CICD

```bash
cd ansilbe
ansible-playbook cicd.yml
```

## TODO

- [ ] test coverage reach 100%
- [ ] room name able to setup/change
- [ ] room role: administer, menber, manager, room member
- [ ] room icon
- [ ] room online people display status
- [ ] one account can only login for one user
- [ ] webRTC - may need learn the course
- [ ] add a vitural scroll container
- [ ] BUG: when join default room, chatroom do 2 times ws push, need to be fixed!
