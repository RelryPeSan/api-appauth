const multer = require('multer');

// Os objetos e suas funções são automaticamentes executadas pela biblioteca, no momento do Upload.
// Nessas funções, teremos acesso a requisição, a alguns dados do arquivo, e um callback que vamos

const storeMemory = multer({
  // Como deve ser feito o armazenamento dos arquivos?
  storage: multer.memoryStorage(),

  // Como esses arquivos serão filtrados, quais formatos são aceitos/esperados?
  fileFilter: (req, file, cb) => {
    // Procurando o formato do arquivo em um array com formatos aceitos
    // A função vai testar se algum dos formatos aceitos do ARRAY é igual ao formato do arquivo.
    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find(
      formatoAceito => formatoAceito == file.mimetype
    );

    // O formato do arquivo bateu com algum aceito?
    if (isAccepted) {
      // Executamos o callback com o segundo argumento true (validação aceita)
      cb(null, true);
    }

    // Se o arquivo não bateu com nenhum aceito, executamos o callback com o segundo valor false (validação falhouo)
    cb(null, false);
  },
});

// Vamos expotar nosso módulo multer, que vamos executar passando as nossas configurações
const storeDisk = multer({
  // Como deve ser feito o armazenamento dos arquivos?
  storage: multer.diskStorage({
    // Qual deve ser o destino deles?
    destination: (req, file, cb) => {
      // Setamos o destino como segundo paramêtro do callback
      cb(null, './temp/images');
    },

    // E como devem se chamar?
    filename: (req, file, cb) => {
      const { userid } = req.query;
      const tipo = file.mimetype.substring(file.mimetype.indexOf('/') + 1);

      if (userid === undefined) {
        cb(null, false);
      }

      // Setamos o nome do arquivo que vai ser salvado no segundo paramêtro
      // Apenas concatenei a data atual com o nome original do arquivo, que a biblioteca nos disponibiliza.
      cb(null, `${userid}-${Date.now().toString()}.${tipo}`);
    },
  }),

  // Como esses arquivos serão filtrados, quais formatos são aceitos/esperados?
  fileFilter: (req, file, cb) => {
    // Procurando o formato do arquivo em um array com formatos aceitos
    // A função vai testar se algum dos formatos aceitos do ARRAY é igual ao formato do arquivo.
    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find(
      formatoAceito => formatoAceito == file.mimetype
    );

    // O formato do arquivo bateu com algum aceito?
    if (isAccepted) {
      // Executamos o callback com o segundo argumento true (validação aceita)
      cb(null, true);
    }

    // Se o arquivo não bateu com nenhum aceito, executamos o callback com o segundo valor false (validação falhouo)
    cb(null, false);
  },
});

// const upload = multer({ storage: storage });

module.exports = storeMemory;
// module.exports = storeDisk;
