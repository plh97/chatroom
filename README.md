# Chatroom

## Architecture

- Development(lerna)

  - package

    - frontend

      vite + react + ts + tailwind + redux[dispatch(action/asyncthunk)]

    - backend

      nodejs + koajs + cors + koa-router + koa-static

    - db

      docker-compose + mongodb

- Deploy
  - terraoform create a Vultr EC2 service
  
  - ansible create vm environment
  
  - ansible clone project
  
  - ansible deploy the project

## dev

```bash
cd $ROOT_DIR
yarn
yarn run dev
```

## TODO

- [x] if not login, redirect to login screen
- [x] use terrform to create vultr instance
- [x] use ansible to crate VM
- [ ] room name able to setup/change
- [ ] room role: administer, menber, manager, room member
- [ ] room icon
- [ ] room online people display status
- [ ] one account can only login for one user
- [ ] webRTC - may need learn the course
