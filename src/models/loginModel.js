const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// Sempre que for trabalhar com base de dados deve ser usado promisses
// LoginModel retorna uma promisse
const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body){
    this.body = body
    this.errors = []
    this.user = null
  }

  async login() {
    this.valida()
    // Se existir algum erro em this.errors não pode validar o usuário
    if(this.errors.length > 0) return
    this.user = await LoginModel.findOne({email: this.body.email})

    if(!this.user){
      this.errors.push('Usuário não existe.')
      return
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)){
      this.errors.push('Senha inválida.')
      this.user = null
      return
    }
  }

  async register() {
    this.valida()
    // Se existir algum erro em this.errors não pode validar o usuário
    if(this.errors.length > 0) return

    await this.userExists()

    if(this.errors.length > 0) return

    // bcryptjs é usado para mandar a senha para a base de dados criptografada
    const salt = bcryptjs.genSaltSync()
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    this.user = await LoginModel.create(this.body)
    
  }

  async userExists() {
    // Método findOne() significa encontrar Um na base de dados que seja igual ao parâmetro passado
    // Que tenha um email que seja igual ao email que está sendo enviado no parãmetro
     this.user = await LoginModel.findOne({email: this.body.email})

    if(this.user){
      this.errors.push('Usuário já existe.')
    }
  }

  valida() {
    // Limpa o objeto com o cleanUp
    this.cleanUp()
    // Validação
    // O e-mail precisa ser valido
    if(!validator.isEmail(this.body.email)){
      this.errors.push('E-mail inválido')
    }
    // A senha precisa ter entre 6 e 15 caracteres 
    if(this.body.password.length < 6 || this.body.password.length > 15){
      this.errors.push('A senha precisa ter entre 6 e 15 caracteres.')
    }
  }

  cleanUp(){
    // Percorre todos os inputs do body e deixa vazio se não forem strings
    for(const key in this.body){
      if(typeof this.body[key] !== 'string'){
        this.body[key] = ''
      }
    }

    this.body = {
      // Garantindo que o objeto body tenha somente os campos desejados
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login;
