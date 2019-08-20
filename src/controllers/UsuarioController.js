const Usuario = require('../models/Usuario');
const Utils = require('../controllers/Utils');

// index, show, store, update, destroy
/*
    index:      GET
    show:       GET
    store:      POST
    update:     PUT
    destroy:    DELETE
 */
module.exports = {
    async getById(req, res) {
        const { usuarioId } = req.params;
        var response = null;

        try {
            response = await Usuario.findById(usuarioId);
        } catch (error) {
            return res.status(400).json({response, error});
        }

        return res.json({response, error: null});
    },

    async find(req, res) {
        const { page = 1, limit = 10 } = req.query;
        const { strnome, strlogin, strsenha, stremail } = req.body;
        var response = null;

        try {
            response = await Usuario.paginate({
                strnome: {$regex: new RegExp(strnome)},
                strlogin: {$regex: new RegExp(strlogin)},
                strsenha: {$regex: new RegExp(strsenha)},
                stremail: {$regex: new RegExp(stremail)},
            }, {
                page: parseInt(page),
                limit: parseInt(limit),
            });
        } catch (error) {
            return res.status(400).json({response, error});
        }

        return res.json({response, error: null});
    },

    async login(req, res) {
        const { user, pass } = req.query;
        var response = null;
        
        try {
            response = await Usuario.findOne({
                strlogin: user,
                strsenha: pass,
            });
        } catch (error) {
            return res.status(400).json({response, error});
        }
        
        return res.json({response, error: null});
    },

    async create(req, res) {
        const { strnome, strlogin, strsenha, stremail, strfotoperfil } = req.body;
        var response = null;

        try {
            // verifica se já não existe um login ou email cadastrado
            const existEmail = (await Usuario.findOne({stremail}) ? true : false);
            const existLogin = (await Usuario.findOne({strlogin}) ? true : false);

            if(existEmail || existLogin){
                console.warn('Usuário já possui um login ou email repetido.');
                return res.json({response, error: {message: 'Usuário já existente', existEmail, existLogin} });
            }

            response = await Usuario.create({
                strnome,
                strlogin,
                strsenha,
                stremail,
                strfotoperfil,
                blncontaativada: true,
                blnemailconfirmado: false,
            });
            
            Utils.gerarCodigoVerificacaoEmail(response._id, stremail, (err, res) => {
                if(err) {
                    return res.status(400).json({response, err});
                }
            });
            
        } catch (error) {
            return res.status(400).json({response, error});
        }

        return res.json({response, error: null});
    },

    update(req, res) {
        const { userid } = req.query;
        const body = req.body;

        const condicao = { _id: userid };
        const novosValores = { $set: body };

        Usuario.updateOne(condicao, novosValores, (err, raw) => {
            if(err){
                console.log(new Error(`Não foi possivel atualizar`));
                res.json(err);
            } else {
                console.log(`Upload com sucesso.`);
                res.json(body);
            }
        });
        // res.json({error: 'Não implementado ainda.'});
    },

    destroy(req, res) {
        res.json({error: 'Não implementado ainda.'});
    }
}