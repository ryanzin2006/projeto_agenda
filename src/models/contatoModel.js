const mongoose = require('mongoose');
const validator = require('validator')

const contatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, required: false, default: Date.now },
});

const contatoModel = mongoose.model('contato', contatoSchema);

function Contato(body) {
  this.body = body
  this.errors = []
  this.contato = null
}


// Esta função (register()) trabalha direto com a base de dados por isso deve ser assincrona
Contato.prototype.register = async function() {
  this.valida()
  if(this.errors.length > 0){
    return
  }
  this.contato = await contatoModel.create(this.body)
}

Contato.prototype.valida = function() {
  // Limpa o objeto com o cleanUp
  this.cleanUp()
  // Validação
  // O e-mail precisa ser valido
  if(this.body.email && !validator.isEmail(this.body.email)){
    this.errors.push('E-mail inválido')
  }
  if(!this.body.nome){
    this.errors.push('Nome é um campo obrigatório.')
  }
  if(!this.body.email && !this.body.telefone){
    this.errors.push('Pelo ou menos um contato precisa ser enviado: e-mail ou telefone.')
    
  }
}

Contato.prototype.cleanUp = function(){
  // Percorre todos os inputs do body e deixa vazio se não forem strings
  for(const key in this.body){
    if(typeof this.body[key] !== 'string'){
      this.body[key] = ''
    }
  }

  this.body = {
    // Garantindo que o objeto body tenha somente os campos desejados
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  }
}

Contato.prototype.edit = async function(id){
  if(typeof id !== 'string') return
  this.valida()
  if(this.errors.length > 0) return
  // { new: true } faz com que quando forem atualizados os dadois eles retornem já atualizados
  this.contato = await contatoModel.findByIdAndUpdate(id, this.body, { new: true })
}

// Métodos estáticos (são aqueles que não vão para o prototype)

Contato.buscaPorId = async function(id) {
  if(typeof id !== 'string') return
  const contato = await contatoModel.findById(id)
  return contato
}

Contato.buscaContatos = async function() {
  const contatos = await contatoModel.find()
  .sort({ criadoEm: -1 })
  return contatos
}

Contato.delete = async function(id) {
  if(typeof id !== 'string') return
  const contato = await contatoModel.findOneAndDelete({_id: id})
  return contato
}

module.exports = Contato;
