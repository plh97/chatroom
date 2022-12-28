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
  - terraoform 开一个 AWS EC2 服务
  - ansible 部署 VM
  - K8S 建立 Container
  - container 里面跑个 nodejs 服务

## deploy

TODO

## dev

```bash
lerna run dev
```

## TODO

- [x] if not login, redirect to login screen
- [ ] use terrform to create vultr instance
- [ ] use ansible to crate VM
- [ ] room online people display status
- [ ] room name able to setup/change
- [ ] room role: administer, menber, manager, room member
- [ ] room icon
- [ ] room style
- [ ] webRTC - may need learn the course
- [ ] one account can only login for one user
