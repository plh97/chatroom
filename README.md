# Chatroom

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
- [ ] add hostname plh.xyz
- [ ] add https
- [ ] room name able to setup/change
- [ ] room role: administer, menber, manager, room member
- [ ] room icon
- [ ] room online people display status
- [ ] one account can only login for one user
- [ ] webRTC - may need learn the course
