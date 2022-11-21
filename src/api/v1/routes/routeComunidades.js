const express = require('express');
const router = express.Router();
const taAutenticade = require('../middlewares/authentication');
const path = require('path');
const multer = require('multer');
const update = multer({ dest: path.join(path.resolve(__dirname, '../../../../static/temp')) });
const serviceComunidades = require('../services/serviceComunidades');
const servicePaginasComunitarias = require('../services/servicePaginasComunitarias');
const serviceObjetosComunitarios = require('../services/serviceObjetosComunitarios');
const serviceImagensComunitarias = require('../services/serviceImagensComunitarias');
const serviceTextosComunitarios = require('../services/serviceTextosComunitarios');
const serviceComentarios = require('../services/serviceComentarios');

router.use(taAutenticade);

// ---
// dados gerais das comunidades

router.get('/', async (req, res, next) => {
	try {
		const comunidades = await serviceComunidades.getComunidades();
		res.json(comunidades);
	} catch (erro) {
		next(erro);
	}
	
});

router.get('/:arroba', async (req, res, next) => {
	try {
		const comunidade = await serviceComunidades.getComunidade(req.params.arroba);
		res.json(comunidade);
	} catch (erro) {
		next(erro);
	}
	
});

router.put('/:arroba', async (req, res, next) => {
	try {
		const dados = req.body;
		const pessoaId = req.user.pessoa_id;
		await serviceComunidades.putComunidade(dados, pessoaId);
		res.status(204).end();
	} catch (erro) {
		next(erro);
	}
	
});

router.post('/', async (req, res, next) => {
	try {
		const dados = req.body;
		const pessoaId = req.user.pessoa_id;
		const comunidade = await serviceComunidades.postComunidade(dados, pessoaId);
		res.status(201).json(comunidade);
	} catch (erro) {
		next(erro);
	}
});

router.delete('/:arroba', async (req, res, next) => {
	try {
		const comunidadeId = req.params.arroba;
		await serviceComunidades.deleteComunidade(comunidadeId, req.user.pessoa_id);
		res.status(204).end();
	} catch (erro) {
		next(erro);
	}
	
});

// ---
// páginas comunitárias

router.get('/:arroba/paginas', async (req, res, next) => {
	try {
		const paginas = await servicePaginasComunitarias.getPaginasComunitarias(req.params.arroba);
		res.json(paginas);
	} catch (erro) {
		next(erro);
	}
	
});

router.get('/:arroba/:pagina', async (req, res, next) => {
	try {
		const caminhoDoArquivo = await servicePaginasComunitarias.getPaginaComunitaria(req.params.arroba, req.params.pagina);
		res.sendFile(caminhoDoArquivo);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/:pagina/blocos', async (req, res, next) => {
	try {
		const blocos = await servicePaginasComunitarias.getBlocosPaginaComunitaria(req.params.pagina);
		res.json(blocos);
	} catch (erro) {
		next(erro);
	}
});

router.post('/:arroba/paginas', async (req, res, next) => {
	try {
		const dados = {
			comunidade_id: req.params.arroba,
			titulo: req.body.titulo,
			publica: req.body.publica,
			html: req.body.html
		};

		// falta validar dados e sanitizar o html

		const dadosCriados = await servicePaginasComunitarias.createPaginaComunitaria(dados, req.user.pessoa_id);
		res.status(201).json(dadosCriados);

	} catch (erro) {
		next (erro);
	}
});

router.put('/:arroba/:pagina', async (req, res, next) => {
	try {
		const dados = {
			comunidade_id: req.params.arroba,
			pagina_comunitaria_id: req.params.pagina,
			titulo: req.body.titulo,
			publica: req.body.publica,
			html: req.body.html
		};

		// falta validar dados e sanitizar o html

		const dadosModificados = await servicePaginasComunitarias.editPaginaComunitaria(dados, req.user.pessoa_id);
		res.status(200).json(dadosModificados);

	} catch (erro) {
		next (erro);
	}
});

router.delete('/:arroba/:pagina', async (req, res, next) => {
	try {
		const dados = {
			comunidade_id: req.params.arroba,
			pagina_comunitaria_id: req.params.pagina
		};

		await servicePaginasComunitarias.deletePaginaComunitaria(dados, req.user.pessoa_id);
		res.status(204).end();

	} catch (erro) {
		next(erro);
	}
});

// ---
// objetos comunitários

router.get('/:arroba/objetos/avatar', async (req, res, next) => {
	try {
		const dadosDaComunidade = await serviceComunidades.getComunidade(req.params.arroba);
		const nomeDoArquivo = dadosDaComunidade.avatar;
		const caminhoDoArquivo = path.join(path.resolve(__dirname, '../../../../static'), 'comunidades', req.params.arroba, 'imagens', nomeDoArquivo);
		res.sendFile(caminhoDoArquivo);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/fundo', async (req, res, next) => {
	try {
		const dadosDaComunidade = await serviceComunidades.getComunidade(req.params.arroba);
		const nomeDoArquivo = dadosDaComunidade.fundo;
		const caminhoDoArquivo = path.join(path.resolve(__dirname, '../../../../static'), 'comunidades', req.params.arroba, 'imagens', nomeDoArquivo);
		res.sendFile(caminhoDoArquivo);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/pessoas', async (req, res, next) => {
	try {
		const pessoas = await serviceObjetosComunitarios.getPessoasNaComunidade(req.params.arroba);
		res.json(pessoas); 
	} catch (erro) {
		next(erro);
	}
});

// ---
// imagens comunitarias

router.get('/:arroba/objetos/imagens', async (req, res, next) => {
	try {
		const imagens = await serviceImagensComunitarias.getImagensComunitarias(req.params.arroba);
		res.json(imagens);
	} catch (erro) {
		next(erro);
	}
	
});

router.get('/:arroba/objetos/imagem', async (req, res, next) => { // imagem?id=valor&info=true&comentarios=true (info e comentarios são opcionais)
	try {

		if (req.query.info) {
			const info = await serviceImagensComunitarias.getInfoImagemComunitaria(req.params.arroba, req.query.id);
			res.json(info);
		} else if (req.query.comentarios) {
			const comentarios = await serviceComentarios.getComentariosImagem(req.query.id);
			res.json(comentarios);
		} else {
			const caminhoDoArquivo = await serviceImagensComunitarias.getImagemComunitaria(req.params.arroba, req.query.id);
			res.sendFile(caminhoDoArquivo);
		}

	} catch (erro) {
		next(erro);
	}
});

router.post('/:arroba/objetos/imagens', update.single('arquivo'), async (req, res, next) => {
	try {

		const dados = {
			comunidade_id: 	req.params.arroba,
			pessoa_id: 		req.user.pessoa_id,
			descricao: 		req.body.descricao,
			album: 			req.body.album
		};

		const dadosCriados = await serviceImagensComunitarias.postImagemComunitaria(dados, req.file);
		res.status(201).json(dadosCriados);

	} catch (erro) {
		next (erro);
	}
});

router.put('/:arroba/objetos/imagem', async (req, res, next) => { // imagem?id=valor
	try {
		const dados = {
			comunidade_id: 			req.params.arroba,
			imagem_comunitaria_id: 	req.query.id,
			pessoa_id: 				req.user.pessoa_id,
			descricao: 				req.body.descricao,
			album: 					req.body.album
		};

		const dadosModificados = await serviceImagensComunitarias.editImagemComunitaria(dados);
		res.status(200).json(dadosModificados);

	} catch (erro) {
		next (erro);
	}
});

router.delete('/:arroba/objetos/imagem', async (req, res, next) => { // imagem?id=valor
	try {
		const dados = {
			comunidade_id: 			req.params.arroba,
			pessoa_id: 				req.user.pessoa_id,
			imagem_comunitaria_id: 	req.query.id
		};

		await serviceImagensComunitarias.deleteImagemComunitaria(dados);
		res.status(204).end();

	} catch (erro) {
		next(erro);
	}
});

// ---
// textos comunitários

router.get('/:arroba/objetos/textos', async (req, res, next) => { // opcional: textos?blog=nome-do-blog
	try {
		let textos;
		if (req.query.blog) {
			textos = await serviceTextosComunitarios.getTextosBlogComunitario(req.params.arroba, req.query.blog);
		} else {
			textos = await serviceTextosComunitarios.getTextosComunitarios(req.params.arroba);
		}
		
		res.json(textos);
	} catch (erro) {
		next(erro);
	}
});

router.get('/:arroba/objetos/texto', async (req, res, next) => { // texto?id=valor&info=true&comentarios=true
	try {

		// se a query inclui "info", envia apenas as informações sobre o texto
		if (req.query.info) {
			const info = await serviceTextosComunitarios.getInfoTextoComunitario(req.params.arroba, req.query.id);
			res.json(info);

		// se a query inclui "comentarios", envia apenas os comentários do texto
		} else if (req.query.comentarios) {
			const comentarios = await serviceComentarios.getComentariosTexto(req.query.id);
			res.json(comentarios);

		// caso contrário, envia o arquivo
		} else {
			const caminhoDoArquivo = await serviceTextosComunitarios.getTextoComunitario(req.params.arroba, req.query.id);
			res.sendFile(caminhoDoArquivo);
		}

	} catch (erro) {
		next(erro);
	}
});

router.post('/:arroba/objetos/textos', async (req, res, next) => {
	try {

		const dados = {
			comunidade_id: 	req.params.arroba,
			pessoa_id:		req.user.pessoa_id,
			titulo: 		req.body.titulo,
			blog: 			req.body.blog,
			texto: 			req.body.texto
		};

		const dadosCriados = await serviceTextosComunitarios.postTextoComunitario(dados);
		res.status(201).json(dadosCriados);

	} catch (erro) {
		next (erro);
	}
});

router.put('/:arroba/objetos/texto', async (req, res, next) => { // texto?id=valor
	try {
		const dados = {
			comunidade_id: 			req.params.arroba,
			texto_comunitario_id: 	req.query.id,
			titulo: 				req.body.titulo,
			blog: 					req.body.blog,
			texto:					req.body.texto
		};

		const dadosModificados = await serviceTextosComunitarios.editTextoComunitario(dados);
		res.status(200).json(dadosModificados);

	} catch (erro) {
		next (erro);
	}
});

router.delete('/:arroba/objetos/texto', async (req, res, next) => { // texto?id=valor
	try {
		const dados = {
			comunidade_id:			req.params.arroba,
			texto_comunitario_id: 	req.query.id
		};

		await serviceTextosComunitarios.deleteTextoComunitario(dados);
		res.status(204).end();

	} catch (erro) {
		next(erro);
	}
});

// ---
// comentários

router.post('/:arroba/objetos/comentarios', async (req, res, next) => { // comentarios?texto=id&imagem=id
	try {

		const dados = {
			comunidade_id: 	req.params.arroba,
			pessoa_id:		req.user.pessoa_id,
			titulo: 		req.body.titulo,
		};

		if (req.query.texto) {
			dados.texto_id = req.query.texto;
		} else if (req.query.imagem) {
			dados.imagem_id = req.query.imagem;
		}

		const dadosCriados = await serviceComentarios.postComentario(dados);
		res.status(201).json(dadosCriados);

	} catch (erro) {
		next (erro);
	}
});

router.delete('/:arroba/objetos/comentarios', async (req, res, next) => { // comentarios?id=valor
	try {

		await serviceComentarios.deleteComentario(req.query.id);
		res.status(204).end();

	} catch (erro) {
		next(erro);
	}
});

module.exports = router;