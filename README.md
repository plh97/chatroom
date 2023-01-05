# Chatroom

## Architecture

- Development(lerna)

  - package

    - frontend
      - vite[unplugin-auto-import/vite]
      - eslint+prettier
      - @chakra-ui/react
      - react
      - typescript
      - tailwind
      - redux[dispatch(action/asyncthunk)]
      - socket-io/client
    - backend
      - nodejs
      - typescript
      - socket.io
      - koajs
      - cors
      - koa-router
      - koa-static

- Deploy
  - terraoform create a Vultr EC2 service
  - ansible create vm environment
  - ansible clone project
  - install dependences
  - build project
  - deploy project inside docker

## dev

```bash
yarn
yarn run dev
```

## TODO

- [x] if not login, redirect to login screen
- [x] use terrform to create vultr instance
- [x] use ansible to crate VM
- [ ] terraform get env variable
- [ ] add circleci to triger the CDCI
- [ ] add hostname plh.xyz
- [ ] add https
- [ ] room name able to setup/change
- [ ] room role: administer, menber, manager, room member
- [ ] room icon
- [ ] room online people display status
- [ ] one account can only login for one user
- [ ] webRTC - may need learn the course
