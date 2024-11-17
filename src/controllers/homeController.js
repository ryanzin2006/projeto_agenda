const contato = require('../models/contatoModel')

exports.index = async(req, res) => {
  const contatos = await contato.buscaContatos()
  // Injetando os contatos dentro do index que foram buscados 
  res.render('index', { contatos });
};
