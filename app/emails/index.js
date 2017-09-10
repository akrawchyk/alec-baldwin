const Koa = require('koa')
const Router = require('koa-trie-router')

const router = new Router()
  .get('/', ctx => {
    ctx.body = 'Emails index'
  })
  .post('/', ctx => {
    // fetch('/emails', {
    //   method: 'POST',
    //   body: JSON.stringify({ asdf: 1234 }),
    //   headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //       }
    //    }).then(res => res.json().then(json => console.log(json)))

    const body = ctx.request.body
    ctx.body = body
  })

// show email by name/hash?

module.exports = router
