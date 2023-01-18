# [Chatroom](http://chat.plhh.xyz/) &middot; [![Github Action Status](https://github.com/plh2/chatroom/actions/workflows/github-CICD-actions.yml/badge.svg)](https://github.com/plh2/chatroom/actions)

## Architecture

- Development(lerna)
  - mongodb - datebase
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
    - backend
      - node+ts
      - socket.io
      - koajs
      - cors
      - koa-router
      - koa-static

## Dev

```bash
yarn
yarn run bootstrap
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

- [x] if not login, redirect to login screen
- [x] use terrform to create vultr instance
- [x] use ansible to crate VM
- [X] terraform get env variable
- [X] add github action handle CDCI
- [x] when tf create a new instance, auto add a DNS record bind with the new instance ip address
- [ ] backend, add eslint + prettier
- [ ] project add husky + git commit hooks auto triger test and lint
- [ ] test coverage reach 100%
- [ ] add https
- [ ] add http2
- [ ] add http3
- [ ] room name able to setup/change
- [ ] room role: administer, menber, manager, room member
- [ ] room icon
- [ ] room online people display status
- [ ] one account can only login for one user
- [ ] webRTC - may need learn the course
