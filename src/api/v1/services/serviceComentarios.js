const dataComentarios = require('../data/dataComentarios');

exports.getComentario = async function (comentarioId) {

	let objetoComentario = await dataComentarios.getComentario(comentarioId);
	return objetoComentario.rows[0];
};

exports.getComentariosComunidade = async function (comunidadeId) {
	let objetoComentarios = await dataComentarios.getComentariosComunidade(comunidadeId);
	const sortedComentarios = objetoComentarios.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedComentarios;
};

exports.getComentariosPessoa = async function (pessoaId) {
	let objetoComentarios = await dataComentarios.getComentariosPessoa(pessoaId);
	const sortedComentarios = objetoComentarios.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedComentarios;
};

exports.getComentariosTexto = async function (textoId) {
	let objetoComentarios = await dataComentarios.getComentariosTexto(textoId);
	return objetoComentarios.rows[0];
};

exports.getComentariosImagem = async function (imagemId) {
	let objetoComentarios = await dataComentarios.getComentariosImagem(imagemId);
	return objetoComentarios.rows[0];
};

exports.postComentario = async function (dados) {

	const dataResponse = await dataComentarios.createComentario(dados);
	dados.comentario_id = dataResponse.rows[0].comentario_id;

	if (dados.texto_id) {
		await dataComentarios.createComentarioTexto(dados);
	} else if (dados.imagem_id) {
		await dataComentarios.createComentarioImagem(dados);
	}
	
	return dados;
};

exports.deleteComentario = async function (comentarioId) {
	const dataResponse = await dataComentarios.deleteComentario(comentarioId);
	return dataResponse.rows[0];
};