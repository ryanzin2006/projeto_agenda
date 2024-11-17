const Login = require('../models/loginModel')

exports.index = (req, res) => {
    // Aqui está a sesssão do usuário
    if(req.session.user){
       return res.render('login-logado')
    }
    console.log(req.session.user)
    return res.render('login')
}

// req.body é de onde vem o post de formularios 
// no caso são os names dos input que vao pra la 
// req.body recebe os dados dos inputs do formulario de login.ejs
exports.register = async(req, res) => {
    try {
    const login = new Login(req.body)
    await login.register()

    if(login.errors.length > 0){
        req.flash('errors', login.errors)
        // Salva a sessão
        req.session.save(function() {
            // Redireciona de volta para a página de login
            return res.redirect('/login/index')
        })
        return
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.')
    // Salva a sessão
    req.session.save(function() {
        // Redireciona de volta para a página de login
        return res.redirect('/login/index')
    })
    } catch(e){
        console.log(e)
        return res.render('404')
    }
    
}

exports.login = async(req, res) => {
    try {
    const login = new Login(req.body)
    await login.login()

    if(login.errors.length > 0){
        req.flash('errors', login.errors)
        // Salva a sessão
        req.session.save(function() {
            // Redireciona de volta para a página de login
            return res.redirect('/login/index')
        })
        return
    }

    req.flash('success', 'Você entrou no sistema.')
    req.session.user = login.user
    // Salva a sessão
    req.session.save(function() {
        // Redireciona de volta para a página de login
        return res.redirect('/login/index')
    })
    } catch(e){
        console.log(e)
        return res.render('404')
    }
    
}

exports.logout =  (req, res) => {
    req.session.destroy()
    res.redirect('/')
}